import DiscordForm from "@/components/DiscordForm";
import { Main } from "@/components/Main";
import Search from "@/components/Search";
import { Subtitle } from "@/components/Subtitle";
import { Title } from "@/components/Title";
import {
  ZkConnectButton,
  ZkConnectClientConfig,
  ZkConnectResponse,
  AuthType,
} from "@sismo-core/zk-connect-react";
import axios from "axios";
import { useState } from "react";

export const zkConnectConfig: ZkConnectClientConfig = {
  appId: process.env.NEXT_PUBLIC_APP_ID,
  devMode: {
    // enable or disable dev mode here to create development groups and use the development vault.
    enabled: process.env.NEXT_PUBLIC_ENV_NAME === "LOCAL" ? true : false,
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

export default function Home() {
  const [verifying, setVerifying] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [zkConnectResponse, setZkConnectResponse] = useState<ZkConnectResponse | null>(null);

  async function onSubmitDiscordId(discordId: string) {
    console.log("Submitting discord id: ", discordId);
    const res = await axios.post(`/api/subscribe`, {
      discordId: discordId,
      zkConnectResponse,
    });

    return res;
  }

  console.log("APP id: ", process.env.NEXT_PUBLIC_APP_ID)
  console.log("Subscription status: ", subscriptionStatus)

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
            //   groupId: "0x42c768bb8ae79e4c5c05d3b51a4ec74a",
            // }}
            onResponse={(response) => {
              setVerifying(true);
              setZkConnectResponse(response);
              axios
                .post(`/api/subscribe`, {
                  zkConnectResponse: response,
                })
                .then((res) => {
                  setVerifying(false);
                  setSubscriptionStatus(res.data.status);
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
        <DiscordForm
          onSubmitDiscordId={onSubmitDiscordId}
          subscriptionStatus={subscriptionStatus}
        />
      )}
    </Main>
  );
}
