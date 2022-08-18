const homepage = "http://localhost:3000";
const login = async() => {
    document.querySelector('#NFTs').innerHTML = ``;
    document.querySelector('#theMessage').innerHTML = ``;
    document.querySelector('#jwt-auth').innerHTML = ``;
    const wallet = await provider.send("eth_requestAccounts", []);
    // Build the initial request object which which to call Moralis Auth API
    // I have hard coded most of these
    const messageObject = {
        address: await getWallet().then(res => res[0]),
        network: "evm",
        domain: "localhost:3000",
        chain: 1,
        statement: "Please confirm",
        uri: homepage,
        timeout: value=60,
    }
    // Use the backend to call the Moralis Auth API to receive a message that the user should sign
    const res = await axios.post(`${homepage}/send-data`, {messageObject:messageObject, wallet:wallet}, {});
    // Have the user sign the message 
    const signature = await signTheMessage(res?.data.response.message);
    const allDataSoFar = {...res?.data.response, wallet, signature};
    // Use the backend to call the Moralis Auth API to verify the signed message
    // and also convert the data to a JWT
    const verifyData = await axios.post(`${homepage}/verify-data`, {data:allDataSoFar}, {});
    // Save the JWT to local storage so it persist within the browser
    localStorage.setItem("Authorization", 'Bearer ' + verifyData.data.theJWT);
    console.log(verifyData.data);    
    // Update the frontend HTML with the response
    document.querySelector('#theMessage').innerHTML = `<pre>${JSON.stringify(verifyData.data, undefined, 2)}</pre>`;
    return {...res?.data.response};
}

const logout = async() => {
    // Delete the JWT from local storage
    window.localStorage.removeItem('Authorization');
    // Clear the HTML
    document.querySelector('#theMessage').innerHTML = ``;
    document.querySelector('#jwt-auth').innerHTML = ``;
    document.querySelector('#NFTs').innerHTML = ``;
    // Delete items from your database and tidy up...
}

const signTheMessage = async (message) => {
    // Using Ethers to present a sign request on front end, passing in the message received from Moralis
    if (!provider){const provider = new ethers.providers.Web3Provider(window.ethereum, "any");}
    const wallet = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
}

const accessSecretContent = async () => {
    // Send JWT from local storate to backend to verify the user
    const secret = await axios.get(`${homepage}/secret`,{headers: { Authorization:localStorage.getItem('Authorization') }});
    if(secret.data.access){
        document.querySelector('#jwt-auth').innerHTML = `<div><p><h2>Congratulations</h2>Moralis Auth API has worked, you have a valid JWT</p></div><div><button onclick="checkNFTs()">Access Token Gated Content</div><hr/>`;  
    }else{
        document.querySelector('#jwt-auth').innerHTML = `<p>Sign in! You do not have a valid JWT</p> <hr/>`;
    }
}

const checkNFTs = async () => {
    const wallet = await getWallet().then(res => res[0]);
    // Send JWT from local storate to backend to verify the user
    const tokenGate = await axios.post(`${homepage}/token-gate`,{walletAddress:wallet},{headers: { Authorization:localStorage.getItem('Authorization') }});
    if(tokenGate.data.totalNFTs > 0){
        document.querySelector('#NFTs').innerHTML = `<h2>ACCESS GRANTED!</h2><p>Your address: ${wallet}</p><h4>This secret content is available because you hold this NFT</h4><pre>${JSON.stringify(tokenGate.data.NFTs[0],undefined,2)}</pre><hr/>`;
    }else{
        document.querySelector('#NFTs').innerHTML = `<h2>ACCESS DENIED!</h2><p>You don't own the <a href="https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/113461209507512867518933452141320285231135646094834536306130710983923277496520" target="_blank">Moralis Core Keycard NFT</a></p><hr/>`;
        document.querySelector('#theMessage').innerHTML = ``;
        document.querySelector('#jwt-auth').innerHTML = ``;
    }
}
            
// Fetch the wallet address using Ethers
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
async function getWallet (){
    const wallet = await provider.send("eth_requestAccounts", []);
    if(wallet){
        return wallet;
    }
}