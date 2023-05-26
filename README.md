# Sismord Frontend

<div align="center">
  <img src="src/discordchads.svg" alt="Logo" width="150" height="150" style="borderRadius: 20px">

  <h3 align="center">
    Sismord
  </h3>

  <p align="center">
    Made by <a href="https://github.com/0xCaso" target="_blank">0xCaso</a>, <a href="https://github.com/mmatteo23" target="_blank">mmatteo23</a> & <a href="https://github.com/bianc8">bianc8.eth</a>
  </p>
  
  <p align="center">
    <a href="https://discord.gg/jm2TWpTY" target="_blank">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/>
    </a>
  </p>
  <a href="https://www.sismo.io/" target="_blank"></a>
</div>

Sismord is the right utility to manage the user verification process in your Discord server.
With Sismord you can customise the requirements that a user must meet when joining your server all in one place, easing your integration with Sismo and Discord.

## Local setup

To execute the whole application locally, you have to match all the requirements:

### Requirements
1. Clone the [Sismord bot repository](https://github.com/0xCaso/sismord-discord-bot) (follow the readme instructions to set up the bot).
2. Create your own Discord server, and in the server settings create a new role with the same name as the one you have defined in the `.env` file (for example 'chad'). 
3. Create a [Discord application](https://discord.com/developers/applications) with a bot, copy the Application ID and it will be the `discordServerId` variable in the `src/routes/Servers.tsx` file.
4. In the application at the Bot page, allow all the "Privileged Gateway Intents" and click "Save changes". 
5. In the application at the Bot page, click "Reset Token" to create a new bot token, and it will be your DISCORD_BOT_TOKEN env variable in the [sismord-discord-bot](https://github.com/0xCaso/sismord-discord-bot) repository, in the `.env` file.
6. In the application at OAuth2 > Url generator, to set up the OAuth2 flow, in **SCOPES** select "bot" and in **BOT PERMISSIONS** set *"Manage Roles"* and *"Send Messages"*. Copy the "generated URL" and paste it into a new tab in the browser, to add the bot to your server and authorize it.

### Run the application
Met all requirements we can move running the [sismord-frontend](https://github.com/mmatteo23/sismord-frontend):
1. Clone this repository and install the dependencies:
    ```bash
    git clone https://github.com/mmatteo23/sismord-frontend
    cd sismord-frontend
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

### Discord User Verification process
Now you're ready to test the application. You can follow these steps:
1. Join the Discord server created in the requirements section.
2. The bot will send you a message with a link that redirects to the Sismord frontend. Click on the link to start the verification process with Sismo.
3. Follow the zkConnect flow to verify your identity.
4. Once the verification is completed, you will be redirected to the frontend.
5. Now if you go back to the Discord channel, you should see that a new role has been assigned to you.

### Discord Server Owner dashboard **[NEW]**
To test it as a server owner, you have to create a new Discord server and follow the requirements section.

1. When you run the application frontend, you will enter the Discord Server owner page, where you can see the list of all your servers.
2. You can add a new Discord Server manually or edit one that already exists.
3. In the edit modal, you can add Sismo Group Claims to the Discord roles that you have in your server. If you select the **Gitcoin-passport-holder** Group claim, for example, you can enter the minimum value that a user must have in the Gitcoin Passport to be verified.
4. Once you have added the Sismo Group Claims, you can save the changes and the sismord-discord-bot will automatically keep track of these changes for new users in your Discord server.