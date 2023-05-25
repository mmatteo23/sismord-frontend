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
1. Create your own Discord server, and in the server settings create a new role with the same name as the one you have defined in the `.env` file (for example 'chad'). 
2. Create an [application](https://discord.com/developers/applications) with a bot, copy the Application ID and it will be your DISCORD_CLIENT_ID env variable in the `.env` file.
3. In the application at the Bot page, allow all the "Privileged Gateway Intents" and click "Save changes". 
4. In the application at the Bot page, click "Reset Token" to create a new bot token, and it will be your DISCORD_BOT_TOKEN env variable in the `.env` file.
5. In the application at OAuth2 > Url generator, to set up the OAuth2 flow, in **SCOPES** select "bot" and in **BOT PERMISSIONS** set "Manage Roles" and "Send Messages". Copy the "generated URL" and paste it into a new tab in the browser, add the bot to your new server and authorize it.
6. Now your bot is in your server and can verify the membership of new users with Sismo!!

### Steps to run the application
The steps to run the application are the following:
1. Clone the [Sismord bot repository](https://github.com/0xCaso/sismord-discord-bot) (follow the readme instructions to set up the bot).
2. Clone this repository and install the dependencies:
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

Now you're ready to test the application. You can follow these steps:
1. Join the Discord server using the invite link (if you are following the 2nd path, our test discord channel is [here](https://discord.gg/jm2TWpTY), otherwise you have to join the server you created).
2. The bot will send you a message with a link that redirects to the Sismord frontend. Click on the link to go to the verification process.
3. Follow the zkConnect flow to verify your identity.
4. Go back to the Discord channel and you should see a new role assigned to you (in case you followed the 2nd path, you should see the `chad` role, and a channel accessible only if you have that role).