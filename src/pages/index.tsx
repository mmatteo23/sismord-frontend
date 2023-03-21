import EmailForm from '@/components/EmailForm';
import { Main } from '@/components/Main';
import Search from '@/components/Search';
import { Subtitle } from '@/components/Subtitle';
import { Title } from '@/components/Title';
import { ZkConnectButton, ZkConnectClientConfig, ZkConnectResponse } from '@sismo-core/zk-connect-react';
import axios from "axios";
import { useState } from 'react';

export const zkConnectConfig: ZkConnectClientConfig = {
  appId: "0x112a692a2005259c25f6094161007967",
  devMode: {
		enabled: process.env.NEXT_PUBLIC_ENV_NAME === "LOCAL", 
		devAddresses: [ 
      // Add your dev addresses here to become eligible in the DEV env
		  "0x713e0bf8b0239b3d630a1191aa1dacf7363f8852" 
		],
	}
}

enum SubscriptionStatus {
  AlreadySubscribed = "already-subscribed",
  NotSubscribed = "not-subscribed",
}

export default function Home() {
  const [verifying, setVerifying] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [zkConnectResponse, setZkConnectResponse] = useState<ZkConnectResponse | null>(null);

  async function onSubmitEmail(email: string) {
    return await axios.post(`/api/subscribe`, {
      email,
      zkConnectResponse,
    });
  }

  return (<Main>
      {!subscriptionStatus && (<>
          <Title>The Merge Contributors mailing list</Title>
          <Subtitle style={{marginBottom: 30}}>
            Contributors to The Merge can register their email addresses in a
            privacy-preserving manner—gaining access to exclusive tickets for web3
            events.
          </Subtitle>
          <Search groupId="0x42c768bb8ae79e4c5c05d3b51a4ec74a"/>
          <ZkConnectButton 
            config={zkConnectConfig}
            dataRequest={{
              //The merge contributor groupId
              groupId: "0x42c768bb8ae79e4c5c05d3b51a4ec74a"
            }}
            onResponse={(response) => {
              setVerifying(true);
              setZkConnectResponse(response);
              axios
                .post(`/api/subscribe`, { 
                  zkConnectResponse: response 
                })
                .then(res => {
                  setVerifying(false);
                  setSubscriptionStatus(res.data.status);
                })
                .catch(err => {
                  setVerifying(false);
                });
            }}
            verifying={verifying}
            overrideStyle={{
              marginTop: 30
            }}
          />
        </>)
      }
      {
        subscriptionStatus && (
          <EmailForm
            onSubmitEmail={onSubmitEmail}
            subscriptionStatus={subscriptionStatus}
          />
        )
      }
    </Main>
  )
}
