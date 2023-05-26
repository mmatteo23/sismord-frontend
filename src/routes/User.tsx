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

export interface ServerClaim {
  id: string,
  value: number | undefined
}

function User() {
  const [verifying, setVerifying] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [sismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse | null>(null);
  const [validPage, setValidPage] = useState(false);
  const [botError, setBotError] = useState<string>("");
  const [specificError, setSpecificError] = useState<string>("");
  const [serverId, setServerId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [sismoConnectConfig, setSismoConnectConfig] = useState<SismoConnectClientConfig>({
    appId: process.env.REACT_APP_SISMO_APP_ID as string,
    devMode: {
      enabled: process.env.REACT_APP_ENV_NAME === "LOCAL" ? true : false,
      devGroups: [],
    },
  });
  const [claims, setClaims] = useState<any[]>([])

  const searchParams = new URLSearchParams(document.location.search)

  useEffect(() => {
    if (!searchParams.get("sismoConnectResponseCompressed")) {
      localStorage.removeItem("serverId")
      localStorage.removeItem("userId")
      localStorage.removeItem("role")
      localStorage.removeItem("groups")
    }
  }, [])

  useEffect(() => {
    let serverId, userId, role
    if (
      searchParams.get("serverId") && 
      searchParams.get("userId") &&
      searchParams.get("role")
    ) {
      serverId = searchParams.get("serverId")
      userId = searchParams.get("userId")?.replace("%23", "#")
      role = searchParams.get("role")
      localStorage.setItem("serverId", serverId as string)
      localStorage.setItem("userId", userId as string)
      localStorage.setItem("role", role as string)
      let query = `serverId=${serverId}&role=${role}`
      if (!localStorage.getItem("groups")) {
        axios
          .get(`http://localhost:3333/api/discord/getServerGroupIds?${query}`)
          .then((res) => {
            let groupsObject = res.data
            let list = []
            const groups: ServerClaim[] = groupsObject
            if (groups) {
              for (const group of groups) {
                if (group.value === undefined || group.value < 1) {
                  list.push({ groupId: group.id })
                } else {
                  list.push({ groupId: group.id, value: group.value, claimType: ClaimType.GTE })
                }
              }
            }
            localStorage.setItem("groups", JSON.stringify(list))
            setClaims(list)
            let config = sismoConnectConfig
            list.forEach(claim => {
              config.devMode?.devGroups?.push({
                groupId: claim.groupId,
                data: {
                  "0x5853bCAC824fc455C1e448706419633EFc452bC8": 6,
                },
              })
            })
            setSismoConnectConfig(config)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } 

    if (localStorage.getItem("serverId") && localStorage.getItem("userId")) {
      setValidPage(true)
    }
  }, [])

  if(validPage) {
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
            <DiscordChads style={{width: "30%", height: "30%"}}/>
            <Title id="title">Verify your profile to gain access to the exclusive server ⚡</Title>
            <SismoConnectButton
              config={sismoConnectConfig}
              auths={[{ authType: AuthType.VAULT }]}
              claims={claims}
              onResponse={(response) => {
                setVerifying(true);
                setSismoConnectResponse(response);
                axios
                  .post(`http://localhost:3333/api/discord/verify`, {
                    serverId: localStorage.getItem("serverId"),
                    userId: localStorage.getItem("userId"),
                    role: localStorage.getItem("role"),
                    claims: localStorage.getItem("groups"),
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
