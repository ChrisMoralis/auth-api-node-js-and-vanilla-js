require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser'); // for form data
const Moralis = require("moralis").default; // I hear great things about these guys
const jwt = require("jsonwebtoken");
const { EvmChain } = require("@moralisweb3/evm-utils");
const app = express();

// The homepage route is using the index.html and vanilla js file in public folder
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Could be used to store data to simulate a database
const fakeTokenDB = [];

// Request a message from Moralis Auth API
app.post("/send-data", async (req,res) => {
  const message = req.body.messageObject;
  const response = await Moralis.Auth.requestMessage(message);
  const wallet = req.body.messageObject.address;
  res.json({response, wallet});
})

// Verify signed message with Moralis Auth API then generate a JWT
app.post("/verify-data", async (req,res) => {
  const theSignedMessage = {message: req.body.data.message, signature:req.body.data.signature, network:"evm"};
  const {result} = await Moralis.Auth.verify(theSignedMessage);
  // Generate JWT
  const theJWT = await jwt.sign(result, process.env.ACCESS_TOKEN_SECRET);
  const walletAddress = req.body.data.wallet;
  fakeTokenDB.push(theJWT);
  res.json({theJWT,...result});
})

// CHECK FOR VALID JWT
// Verify if user can access 'secret content' by using the authenticateToken middleware function
app.get('/secret', authenticateToken, (req, res) => {
  res.json({access:true});
})

// TOKEN GATING
// Verify if user can access token-gated content by using the authenticateToken middleware function
app.post("/token-gate", authenticateToken, async (req,res) => {
  // Calling Moralis NFT API polygon NFT id: 113461209507512867518933452141320285231135646094834536306130710983923277496520
  const options = {method: 'GET', headers: {Accept: 'application/json', 'X-API-Key': process.env.APIKEY}};
  const nfts = await Moralis.EvmApi.account.getNFTs({address:String(req.body.walletAddress), chain:EvmChain.POLYGON})
  .then((response)=>{
    let NFTs = [];
    if(response._data.total > 0){
      let counter = 0;
      response._data.result.forEach(e=>{
        if(e.token_id === "113461209507512867518933452141320285231135646094834536306130710983923277496520"){
          counter ++;
          NFTs.push(e);
        }
      })
      if(counter > 0){
        res.json({NFTAccess:true, totalNFTs: counter, NFTs});
      }else{
        res.json({NFTAccess:false});
      }
    }else {
      res.json({NFTAccess:false});
    }
  })
})

// Middleware function
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const tokenExists = fakeTokenDB.filter(eachToken => eachToken === token);
    if(tokenExists.length > 0){
      res.locals.token = token;
      next();
    }else{
      return res.sendStatus(401);
    }
  })
}

// Start the server
const startApp = async () => {
  await Moralis.start({
    apiKey: process.env.APIKEY,
  });
  app.listen(3000, () => {
    console.log(`Example app listening on port 3000`);
  });
};
startApp();