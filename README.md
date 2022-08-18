## Quickstart
- `git clone` this repo and 'cd' into it
- `npm install`
- replace `.env.example` with `.env`  
- enter your Moralis API key in `.env`
- `npm start`
- Log into Metamask
- Set your `homepage` link in `functions.js`
- For token gating - update the `token_id` information in `index.js`
- `public` folder is for the front end
- `index.js` is for the backend

# Sign in With Node JS & Express
This guide will show you how to implement a basic full-stack node JS application with a vanilla JS and HTML front-end where the user can login with their MetaMask wallet & Moralis Auth API and establish a JWT. 

This demo let's you use the Moralis Auth API to login to a simple application, create and store a JWT and then use that JWT to verify a user and allow/disallow access to content. There is also a separate NFT token gating component included in this demo. 

- Hit "Login With MetaMask" to generate and sign a new message and JWT.
- "Access Token Gated Content" - checks for valid JWT first, then searches through your NFTs for a specific token_id (you need to configure this in `index.js`). If you hold the NFT, you will see extra content. If you do not, you will see "access denied"
- "Logout" - removes JWT from storage and clears the screen

### Prerequisites
1. Create a Moralis account and have an API key (https://admin.moralis.io/account/profile)
2. Install Visual Studio Code
3. Install Node JS
4. Have MetaMask installed on your browser and log into your wallet

## Create a Node JS application
You can follow this guide (https://docs.moralis.io/docs/nodejs-dapp-from-scratch) which will walk you through how to set up you first couple of files and also set up an Express server to run the backend work. The tutorial also takes you through setting up your Moralis account and then a demonstration of making a call to the Moralis API from the backend (it will fetch and display the native balance of a user, ERC20 balances and even NFTs of a user). I recommend going through that to familiarise yourself.

## Configuring the Server `index.js` and `functions.js` files
There are comments in the code to walk you through the functions and routes. But you will need to update the homepage link if you are not using localhost:3000 and you will need to change the token_id for the NFT used for token gating. Maybe you also want to add a filter for contract, or something else.

## Next Steps

You could increase the error handling and find ways to improve this application.

You could build a completely new front-end and have more token gating examples
