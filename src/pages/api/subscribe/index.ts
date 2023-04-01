// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DataRequest, ZkConnect, ZkConnectServerConfig, AuthType } from '@sismo-core/zk-connect-server';
import type { NextApiRequest, NextApiResponse } from 'next'

enum Status {
  NotSubscribed = "not-subscribed",
  Success = "success",
  Error = "error",
  AlreadySubscribed = "already-subscribed"
}

type Data = { 
  status: Status,
  userId?: string,
  discordId?: string,
  message?: string
}

const zkConnectConfig: ZkConnectServerConfig = {
  appId: process.env.NEXT_PUBLIC_APP_ID,
  devMode: {
    enabled: process.env.NEXT_PUBLIC_ENV_NAME === "LOCAL", 
  }
}

const zkConnect = ZkConnect(zkConnectConfig);

const claimRequest = {
  groupId: "0x42c768bb8ae79e4c5c05d3b51a4ec74a",
};
const authRequest = {
  authType: AuthType.ANON,
};

const discordMemoryStore = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  const { discordId, zkConnectResponse } = req.body;

  try {
    const { verifiedAuths } = await zkConnect.verify(zkConnectResponse, {
      authRequest
      // claimRequest,  // not needed for anon auth
    });
    const userId =  verifiedAuths[0].userId;
    // if discord id is not provided, check if the user is already subscribed
    if (!discordId) {
      if (discordMemoryStore.has(userId)) {
        const existingDiscordId = discordMemoryStore.get(userId);
        res.status(200).send({
          email: existingDiscordId,
          userId,
          status: Status.AlreadySubscribed,
        });
        return;
      }
      res.status(200).send({ status: Status.NotSubscribed, userId });
    } else {
      discordMemoryStore.set(userId, discordId);
      res.status(200).send({ discordId, status: Status.Success, userId });
    }
    // console.log("verified auths", verifiedAuths) 
    // // console.log(zkConnectResponse.proofs[0].claim)
    // res.status(200).send({ 
    //   status: Status.Success, 
    //   userId,
    //   response: zkConnectResponse 
    // });
  } catch (e: any) {
    //If the response is not valid
    res.status(400).send({ status: Status.Error, message: e.message });
  }
}
