import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// import './styles/globals.css';
import {
  ZkConnectButton,
  ZkConnectClientConfig,
  ZkConnectResponse,
  AuthType,
} from "@sismo-core/zk-connect-react";
import { Main } from './components/Main';
import { Title } from './components/Title';
import axios from 'axios';

export const zkConnectConfig: ZkConnectClientConfig = {
  appId: process.env.REACT_APP_APP_ID as string,
  devMode: {
    // enable or disable dev mode here to create development groups and use the development vault.
    enabled: process.env.REACT_APP_ENV_NAME === "LOCAL" ? true : false,
    // devGroups: [
    //   {
    //     groupId: "0x42c768bb8ae79e4c5c05d3b51a4ec74a",
    //     // Add your dev addresses here to become eligible in the DEV env
    //     data: [
    //       "0x2bf7b04f143602692bbdc3ecbea68c2c65278eee",
    //       "0x3f559454185098cb3a496f864a4bdd82b34c7fd1",
    //     ],
    //   },
    // ],
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
  const [serverId, setServerId] = useState<string | null>(null);
  const [discordId, setDiscordId] = useState<string | null>(null);
  
  console.log("APP id: ", process.env.REACT_APP_APP_ID)
  console.log("Subscription status: ", subscriptionStatus)
  
  const searchParams = new URLSearchParams(document.location.search)
  
  useEffect(() => {
    if (searchParams.get("serverId")) {
      const serverId = searchParams.get("serverId")
      const discordId = searchParams.get("discordId")
      // setServerId(serverId)
      // setDiscordId(discordId)
      // console.log(document.location.href)
      // console.log(discordId as string + (document.location.href).split("#")[1])
      localStorage.setItem("serverId", serverId as string)
      localStorage.setItem("discordId", discordId as string + "#" + (document.location.href).split("#")[1])
    } 
  }, [searchParams])




  console.log("Server id: ", serverId)
  console.log("Discord id: ", discordId)

  return (
    <Main>
      {!subscriptionStatus && (
        <>
          <Title>Giccio in the square APP. Are you a Giccio?</Title>
          <ZkConnectButton
            config={zkConnectConfig}
            authRequest={{authType: AuthType.ANON}}
            // claimRequest={{
            //   //The merge contributor groupId
            //   groupId: process.env.NEXT_PUBLIC_SISMO_GROUP_ID,
            // }}
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
                  setVerifying(false);
                });
            }}
            verifying={verifying}
            overrideStyle={{
              marginTop: 30,
            }}
          />
        </>
      )}
      {subscriptionStatus && (
        <Title>You are officially a Giccio in the square</Title>
      )}
    </Main>
  );
}

export default App;
