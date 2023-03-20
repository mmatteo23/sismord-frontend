<br />
<div align="center">
  <img src="https://static.sismo.io/readme/top-main.png" alt="Logo" width="150" height="150" style="borderRadius: 20px">

  <h3 align="center">
    zkSub
  </h3>

  <p align="center">
    Made by <a href="https://www.docs.sismo.io/" target="_blank">Sismo</a>
  </p>
  
  <p align="center">
    <a href="https://discord.gg/uAPtsfNrve" target="_blank">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/>
    </a>
    <a href="https://twitter.com/sismo_eth" target="_blank">
        <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/>
    </a>
  </p>
  <a href="https://www.sismo.io/" target="_blank"></a>
</div>

This repository is a fork of the [zksub](https://github.com/sismo-core/zksub) repository translated from React to Next.js and simplified to help you using zkConnect with Next.js.

The zkSub app allows to register users to a mailing list once they have privately authenticate themselves with [zkConnect](https://github.com/sismo-core/zk-connect-packages) single sign-on. 

The repository is build with Next.js using:
- In the `frontend` we use the [zk-connect-react](https://github.com/sismo-core/zk-connect-packages) package to redirect the user to Sismo Vault App to generate a zero-knowledge proof. Once the proof is generated, the user is redirected back to zkSub and the proof is sent to the backend. 
- In the `backend`, we use the [zk-connect-server](https://github.com/sismo-core/zk-connect-packages) package to verify that the proof is valid. If that's the case, the user is registered to the mailing list.

You can see the deployed demo app at [https://demo.zksub.io/](https://demo.zksub.io/).

Here is a guide to integrate ZK Connect in your own application: [https://zk-connect-guide.sismo.io/](https://zk-connect-guide.sismo.io/).

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18.15.0, latest LTS version)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

In a first terminal:
```sh
# Install dependencies
yarn 

# Start server on http://localhost:3000
yarn dev
```

## Deploy on Vercel



<br/>
<img src="https://static.sismo.io/readme/bottom-main.png" alt="bottom" width="100%" >