import { useEffect, useState } from 'react';
import './user.css';
import {
  SismoConnectButton, // the Sismo Connect React button displayed below
  SismoConnectClientConfig, // the client config with your appId
  SismoConnectResponse,
  AuthType, // the authType enum, we will choose 'VAULT' in this tutorial
  ClaimType // the claimType enum, we will choose 'GTE' in this tutorial, to check that the user has a value greater than a given threshold
} from "@sismo-core/sismo-connect-react";
import { Main } from '../components/Main';
import { Title } from '../components/Title';
import axios from 'axios';
import { Subtitle } from '../components/Subtitle';
import {ReactComponent as DiscordChads} from './../discordchads.svg';

export const GITCOIN_PASSPORT_HOLDERS_GROUP_ID = "0x1cde61966decb8600dfd0749bd371f12";

enum SubscriptionStatus {
  AlreadySubscribed = "already-subscribed",
  NotSubscribed = "not-subscribed",
}

interface groupIdsObject {
  // groupId: value
  // example:
  // `${GITCOIN_GROUP_ID}`: MINPASSPORT_VALUE,
  [key: string]: number
}

function User() {
  const [verifying, setVerifying] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [sismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse | null>(null);
  const [validPage, setValidPage] = useState(false);
  const [botError, setBotError] = useState<string>("");
  const [specificError, setSpecificError] = useState<string>("");

  const searchParams = new URLSearchParams(document.location.search)
  
  useEffect(() => {
    if (searchParams.get("serverId") && searchParams.get("userId")) {
      const serverId = searchParams.get("serverId")
      const userId = searchParams.get("userId")
      const role = searchParams.get("role")
      const groupIds = searchParams.get("groupIds")
      localStorage.setItem("serverId", serverId as string)
      localStorage.setItem("userId", userId as string + "#" + (document.location.href).split("#")[1])
      localStorage.setItem("role", role as string)
      let groupIdsObject: groupIdsObject = {}
      if (groupIds?.includes(";")) {
        const groupIdsArray = groupIds.split(";")
        groupIdsArray.forEach(groupId => {
          if (groupId.includes(":")) {
            const groupIdArray = groupId.split(":")
            groupIdsObject[groupIdArray[0]] = +groupIdArray[1]
          } else {
            groupIdsObject[groupId] = -1
          }
        })
      } else {
        if (groupIds?.includes(":")) {
          const groupIdArray = groupIds?.split(":")
          groupIdsObject[groupIdArray[0]] = +groupIdArray[1]
        } else {
          groupIdsObject[groupIds as string] = -1
        }
      }
      localStorage.setItem("groupIds", JSON.stringify(groupIdsObject))
    } 

    if (localStorage.getItem("serverId") && localStorage.getItem("userId")) {
      setValidPage(true)
    }
  }, [searchParams])

  // build the claims list
  // if the groupId associated value is -1, it's just groupId: "GROUP_ID"
  // otherwise, it's like { groupId: GITCOIN_PASSPORT_HOLDERS_GROUP_ID, value: 1, claimType: ClaimType.GTE },
  const claimsList = () => {
    let list = []
    const groupIdsObject = JSON.parse(localStorage.getItem("groupIds") as string)
    for (const groupId in groupIdsObject) {
      if (groupIdsObject[groupId] === -1) {
        list.push({ groupId: groupId })
      } else {
        list.push({ groupId: groupId, value: groupIdsObject[groupId], claimType: ClaimType.GTE })
      }
    }
    return list
  }

  let sismoConnectConfig: SismoConnectClientConfig = {
    appId: process.env.REACT_APP_SISMO_APP_ID as string,
    devMode: {
      enabled: process.env.REACT_APP_ENV_NAME === "LOCAL" ? true : false,
      // add this line to override the "Gitcoin Passport Holders" group
      // devGroups: [
      //   // {
      //   //   groupId: GITCOIN_PASSPORT_HOLDERS_GROUP_ID,
      //   //   data: [
      //   //     "0x5853bCAC824fc455C1e448706419633EFc452bC8",
      //   //   ],
      //   // },
      // ],
    },
  };

  claimsList().forEach(claim => {
    sismoConnectConfig.devMode?.devGroups?.push({
      groupId: claim.groupId,
      data: [
        "0x5853bCAC824fc455C1e448706419633EFc452bC8",
      ],
    })
  })

  if(!validPage) {
    return (
      <Main>
        {botError && (
          <>
            <Title>{specificError}</Title>
            <Subtitle>{botError}</Subtitle>
            <Subtitle>Whoooopsss! Seems like something went wrong with the bot!</Subtitle>
          </>
        )}
        {(!subscriptionStatus && !botError) && (
          <>
            {/* put the img discordchads.svg */}
            <DiscordChads style={{width: "30%", height: "30%"}}/>
            <Title id="title">Verify your profile to gain access to the exclusive server ⚡</Title>
            <SismoConnectButton
              config={sismoConnectConfig}
              auths={[{ authType: AuthType.VAULT }]}
              claims={claimsList()}
              onResponse={(response) => {
                setVerifying(true);
                setSismoConnectResponse(response);
                axios
                  .post(`http://localhost:3333/api/discord/verifyResponse`, {
                    userId: localStorage.getItem("userId"),
                    serverId: localStorage.getItem("serverId"),
                    discordRole: localStorage.getItem("role"),
                    groupIds: localStorage.getItem("groupIds"),
                    sismoConnectResponse: response,
                  })
                  .then((res) => {
                    console.log(res)
                    setVerifying(false);
                    setSubscriptionStatus(SubscriptionStatus.AlreadySubscribed);
                  })
                  .catch((err) => {
                    console.log(err)
                    setVerifying(false);
                    setBotError(err.message)
                    setSpecificError(err.response.data)
                  });
              }}
              verifying={verifying}
              text={"Connect with Sismo"}
              overrideStyle={{
                marginTop: 30,
                background: "#715aff",
                border: "1px solid #8b8b8b"
              }}
            />
          </>
        )}
        {(subscriptionStatus && !botError) && (
          <>
            <DiscordChads style={{width: "30%", height: "30%"}}/>
            <Title>You are officially a member of the Discord server!</Title>
            <Subtitle id="success-subtitle">
              If you come back to it, you can see you gained the special role <b>Chad</b> 🗿🍷
            </Subtitle>
          </>
        )}
      </Main>
    );
  } else {
    return (
      <Main>
        <Title>Invalid page</Title>
        <Subtitle>Whoooopsss! Seems like Discord server and User identifier are missing!</Subtitle>
        <p>You can't be a Discord chad without your links</p>
      </Main>
    )
  }
}

export default User;
