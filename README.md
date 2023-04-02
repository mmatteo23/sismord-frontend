# Sismord Frontend

<div align="center">
  <img src="src/discordchads.svg" alt="Logo" width="150" height="150" style="borderRadius: 20px">

  <h3 align="center">
    Sismord
  </h3>

  <p align="center">
    Made by <a href="https://github.com/0xCaso" target="_blank">0xCaso</a> & <a href="https://github.com/mmatteo23" target="_blank">mmatteo23</a></a>
  </p>
  
  <p align="center">
    <a href="https://discord.gg/jm2TWpTY" target="_blank">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/>
    </a>
  </p>
  <a href="https://www.sismo.io/" target="_blank"></a>
</div>

## Local setup

To execute the whole application locally, there are two paths:

### Ways to run the application
1. Create your own Discord bot and server, and fill the `.env` file with your values. To do so, follow the instructions in the [Discord Developer Portal](https://discord.com/developers/docs/intro) and create an [application](https://discord.com/developers/applications) with a bot (the bot should be able to manage roles and send messages). You should also add a specific role in the server, which should match the role added by the bot.
2. Contact us and we will provide you with a bot token and a server ID. You can then fill the `.env` file with the provided values.

### Steps to run the application
The steps to run the application are the following:
1. Clone the [Sismord bot repository](https://github.com/0xCaso/zkhack-lisbon-discord-bot) (follow the readme instructions to set up the bot).
2. Clone this repository and install the dependencies:
    ```bash
    git clone https://github.com/mmatteo23/zkhack-lisbon-frontend
    cd zkhack-lisbon-frontend
    yarn
    ```
3. Create the `.env` file and fill it with the correct values:
    ```bash
    cp .env.example .env
    ```
4. Run the Sismord bot (follow its readme instructions)
5. Run the Sismord frontend:
    ```bash
    yarn start
    ```

Now you're ready to test the application. You can follow these steps:
1. Join the Discord server using the invite link (if you are following the 2nd path, our test discord channel is [here](https://discord.gg/jm2TWpTY), otherwise you have to join the server you created).
2. The bot will send you a message with a link that redirects to the Sismord frontend. Click on the link to go to the verification process.
3. Follow the zkConnect flow to verify your identity.
4. Go back to the Discord channel and you should see a new role assigned to you (in case you followed the 2nd path, you should see the `chad` role).