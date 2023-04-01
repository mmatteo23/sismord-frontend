import { useEffect, useState } from 'react';
import './App.css';
import {
  ZkConnectButton,
  ZkConnectClientConfig,
  ZkConnectResponse,
  AuthType,
} from "@sismo-core/zk-connect-react";
import { Main } from './components/Main';
import { Title } from './components/Title';
import axios from 'axios';
import { Subtitle } from './components/Subtitle';
import {ReactComponent as DiscordChads} from './discordchads.svg';

export const zkConnectConfig: ZkConnectClientConfig = {
  appId: process.env.REACT_APP_APP_ID as string,
  devMode: {
    // enable or disable dev mode here to create development groups and use the development vault.
    enabled: process.env.REACT_APP_ENV_NAME === "LOCAL" ? true : false,
    devGroups: [
      {
        groupId: process.env.REACT_APP_GROUP_ID as string,
        // Add your dev addresses here to become eligible in the DEV env
        data: [
          "0x3E612Ca41B0212c741ED7BdEE37B17a8CcefBcb4",
          "0x5853bCAC824fc455C1e448706419633EFc452bC8",
        ],
      },
    ],
  },
};

enum SubscriptionStatus {
  AlreadySubscribed = "already-subscribed",
  NotSubscribed = "not-subscribed",
}

function App() {
  const [verifying, setVerifying] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [zkConnectResponse, setZkConnectResponse] = useState<ZkConnectResponse | null>(null);
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
            {/* put the img discordchads.svg */}
            <DiscordChads style={{width: "30%", height: "30%"}}/>
            <Title id="title">Verify your profile to gain access to the exclusive server ⚡</Title>
            <ZkConnectButton
              config={zkConnectConfig}
              authRequest={{authType: AuthType.ANON}}
              claimRequest={{
                //The merge contributor groupId
                groupId: process.env.REACT_APP_GROUP_ID as string,
              }}
              onResponse={(response) => {
                setVerifying(true);
                setZkConnectResponse(response);
                axios
                  .post(`http://localhost:3333/`+ localStorage.getItem("serverId") +`/verify`, {
                    discordId: localStorage.getItem("discordId"),
                    zkConnectResponse: response,
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

export default App;
