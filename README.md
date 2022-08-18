## Quickstart
- git clone this repo and 'cd' into it
- npm install
- replace .env.example with .env and enter your Moralis API key
- npm start
- Log into Metamask
- Set your `homepage` link in `functions.js`
- For token gating - update the `token_id` information in `index.js`
- public folder is for the front end
- index.js is for the backend

# Sign in With Node JS & Express
This guide will show you how to implement a basic full-stack node JS application with a vanilla JS and HTML front-end where the user can login with their MetaMask wallet & Moralis Auth API and establish a JWT.

### Prerequisites
1. Create a Moralis account and have an API key (https://admin.moralis.io/account/profile)
2. Install Visual Studio Code
3. Install Node JS
4. Have MetaMask installed on your browser and log into your wallet

## Create a Node JS application
You can follow this guide https://docs.moralis.io/docs/nodejs-dapp-from-scratch which will walk you through how to set up you first couple of files and also set up an Express server to run the backend work. The tutorial also takes you through setting up your Moralis account and then a demonstration of making a call to the Moralis API from the backend (it will fetch and display the native balance of a user, ERC20 balances and even NFTs of a user). I recommend going through that to familiarise yourself.

## Install the packages
`npm install`

## Setting Up Environment Variables .env
Don't use your Moralis keys in the front end!

Rename .env.example to .env add your Moralis API key 

## Configure the Homepage index.html
The homepage requires ethers and axios. 

I've used a HTML forms to submit most data to our Node JS backend because it uses a POST action directly from the form. 

The first thing to do is generate your request object for requesting a message. There is a detailed description of the variables you require for building that object here: https://docs.moralis.io/page/nodejs-sdk-reference

- Hit "Login With MetaMask" to generate and sign a new message and JWT.
- "Get Access To Secret Content" will check whether JWT is valid and provide link to "Access Token Gated Content"
- "Access Token Gated Content" will search through your NFTs for a specific token id (you need to configure which) and let you see content if you hold it

## Configure the Server index.js and functions.js files
Let's remove all the content from the nodejs-dapp-from-scratch tutorial (if you followed it) and use this.

There are comments in the code to walk you through the functions and routes

## Next Steps
You could develop this application to take the user back to the homepage and refresh the browser if they change their wallet. 

You could increase the error handling and find ways to improve this application.

You could build a completely new front-end and have more token gating examples
