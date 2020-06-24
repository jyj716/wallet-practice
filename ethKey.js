import Web3 from "web3";

const web3 = new Web3();

const privateKey = "0x35E2642A3C3D73C6DA323C6DC58BD7E92EE8DECE9813BFC6963C13FBFA3F2D1C";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

console.log(account);
