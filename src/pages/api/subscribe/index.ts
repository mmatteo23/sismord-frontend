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
  email?: string,
  message?: string
}

const zkConnectConfig: ZkConnectServerConfig = {
  appId: "0x112a692a2005259c25f6094161007967",
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

const emailMemoryStore = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { email, zkConnectResponse } = req.body;

  try {
    const { verifiedAuths } = await zkConnect.verify(zkConnectResponse, {
      authRequest,
      claimRequest,
    });
    const userId =  verifiedAuths[0].userId;
    // if email is not provided, check if the user is already subscribed
    if (!email) {
      if (emailMemoryStore.has(userId)) {
        const existingEmail = emailMemoryStore.get(userId);
        res.status(200).send({
          email: existingEmail,
          userId,
          status: Status.AlreadySubscribed,
        });
        return;
      }
      res.status(200).send({ status: Status.NotSubscribed, userId });
    } else {
      emailMemoryStore.set(userId, email);
      res.status(200).send({ email, status: Status.Success, userId });
    }
  } catch (e: any) {
    //If the response is not valid
    res.status(400).send({ status: Status.Error, message: e.message });
  }
}
