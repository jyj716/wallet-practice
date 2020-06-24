//이더리움에서 개인키,공개키 만들기
import crypto from "crypto"; 
//const crypto = require ("crypto");//위와 같음
import secp256k1 from "secp256k1";
import createKeccakHash from "keccak";
import Mnemonic from "bitcore-mnemonic";

function createPrivateKey(){
    let privateKey;
    do{
        privateKey = crypto.randomBytes(32);// 랜덤바이트생성
        //secp256k1.privateKeyVerify(privateKey);//개인키 검증
    } while (secp256k1.privateKeyVerify(privateKey)=== false); //개인키검증이 false일 때 까지 실행
    return privateKey;

}
function createPublicKey(privateKey,compressed = false){//true면 압축함 false면 압축 안 함
    return Buffer.from(secp256k1.publicKeyCreate(privateKey,compressed));
}

function createAddress(publicKey){ //개인키로 압축되지않은 공개키를 만들고 이걸로 keccak256이란 해쉬화를 거쳐 256비트(32바이트(64글자))주소로만듬
    const hash = createKeccakHash("keccak256").update(publicKey.slice(1)).digest("hex")//slice(1) : 앞에 04 이런거뺌 digest("hex") : 16진수 변환
    return "0x"+hash.slice(24);//앞24글자 짜름
}

function toChecksumAddress (address) {
    address = address.toLowerCase().replace('0x', '')
    var hash = createKeccakHash('keccak256').update(address).digest('hex')
    var ret = '0x'
  
    for (var i = 0; i < address.length; i++) {
      if (parseInt(hash[i], 16) >= 8) {
        ret += address[i].toUpperCase()
      } else {
        ret += address[i]
      }
    }
  
    return ret
  }

function privateKeyToAddress(privateKey){
  const publicKey = createPublicKey(privateKey);//개인키로 공개키 만듬
  const address = createAddress(publicKey);
  return toChecksumAddress(address);
}
function createMnemonic(wordsCount = 12){
  if (wordsCount <12 || wordsCount > 24 || wordsCount %3 !== 0){
    throw new Error("invalid number of words");
  }
  const entropy = (16+(wordsCount -12) / 3*4)*8;
  return new Mnemonic(entropy);
}

function mnemonicToPrivateKey(mnemonic){
  const privateKey = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0").privateKey;//mnemonic으로 이더리움 개인키 생성
  return Buffer.from(privateKey.toString(),"hex");
}

// const mnemonic = createMnemonic();//숫자부분은 3의배수입력
console.log(mnemonic.toString());

const privateKey= mnemonicToPrivateKey(mnemonic);
console.log(privateKey.toString("hex"));

const address = privateKeyToAddress(privateKey);
console.log(address);
  //const privateKey = Buffer.from("0000000000000000000000000000000000000000000000000000000000000000","hex")
//const privateKey = Buffer.from("35E2642A3C3D73C6DA323C6DC58BD7E92EE8DECE9813BFC6963C13FBFA3F2D1C","hex");//const는 다시 안 바꿀 값



// let privateKey = createPrivateKey();
// console.log("Private Key: ", privateKey.toString("hex"));
// console.log("Address: ", createAddress(createPublicKey(privateKey)));

///공개키 생성
// console.log(createPublicKey(privateKey).toString("hex"));
// console.log(createPublicKey(privateKey,true).toString("hex")); //압축