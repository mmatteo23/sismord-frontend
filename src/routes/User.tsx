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

// export const zkConnectConfig: ZkConnectClientConfig = {
//   appId: process.env.REACT_APP_SISMO_APP_ID as string,
//   devMode: {
//     // enable or disable dev mode here to create development groups and use the development vault.
//     enabled: process.env.REACT_APP_ENV_NAME === "LOCAL" ? true : false,
//     devGroups: [
//       {
//         groupId: process.env.REACT_APP_GROUP_ID as string,
//         // Add your dev addresses here to become eligible in the DEV env
//         data: [
//           "0x3E612Ca41B0212c741ED7BdEE37B17a8CcefBcb4",
//           "0x5853bCAC824fc455C1e448706419633EFc452bC8",
//         ],
//       },
//     ],
//   },
// };

export const sismoConnectConfig: SismoConnectClientConfig = {
  appId: process.env.REACT_APP_SISMO_APP_ID as string,
  devMode: {
    // enable or disable dev mode here to create development groups and use the development vault.
    enabled: process.env.REACT_APP_ENV_NAME === "LOCAL" ? true : false,
  },
};

export const GITCOIN_PASSPORT_HOLDERS_GROUP_ID = "0x1cde61966decb8600dfd0749bd371f12";
const NOUNS_DAO_HOLDERS_GROUP_ID = "0x311ece950f9ec55757eb95f3182ae5e2";

enum SubscriptionStatus {
  AlreadySubscribed = "already-subscribed",
  NotSubscribed = "not-subscribed",
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
    if (searchParams.get("serverId") && searchParams.get("discordId")) {
      const serverId = searchParams.get("serverId")
      const discordId = searchParams.get("discordId")
      localStorage.setItem("serverId", serverId as string)
      localStorage.setItem("discordId", discordId as string + "#" + (document.location.href).split("#")[1])
    } 

    if (localStorage.getItem("serverId") && localStorage.getItem("discordId")) {
      setValidPage(true)
    }
  }, [searchParams])

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
              // request an additional proof of group membership from your users
              // They should hold a Nouns DAO NFT
              // but also the Gitcoin Passport as before
              claims={[
                { groupId: GITCOIN_PASSPORT_HOLDERS_GROUP_ID, value: 15, claimType: ClaimType.GTE },
                { groupId: NOUNS_DAO_HOLDERS_GROUP_ID } // <-- pass the groupId
              ]}
              // signature={{ message: signMessage(address) }}
              onResponse={(response) => {
                setVerifying(true);
                setSismoConnectResponse(response);
                axios
                  .post(`http://localhost:3333/`+ localStorage.getItem("serverId") +`/verify`, {
                    discordId: localStorage.getItem("discordId"),
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
