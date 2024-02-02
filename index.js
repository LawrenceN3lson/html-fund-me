import { ethers } from "./ethers.min.js";
// 从后端合约编译文件中取出的abi，在前端引入
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const getBalanceButton = document.getElementById("getBalanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
getBalanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== undefined) {
    console.log("MetaMask is installed!");
    // 连接钱包，使用插件的request方法发送eth_requestAccounts请求
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        console.log(accounts);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("connected");
  } else {
    console.log("MetaMask is not installed!");
  }
}

async function fund() {
  if (typeof window.ethereum !== undefined) {
    const amount = document.getElementById("ethAmount").value;
    const ethAmount = ethers.parseEther(amount).toString();
    // 想要用钱包发送一个交易，需要的内容
    // provider RPC节点服务提供者
    // signer / wallet 发送交易的签名人或钱包
    // contract 可以交互的合约(需要知道ABI和合约地址)

    // 前端获取provider，类似于获取一个RPC节点，只不过这个节点是metamask提供的(就是你当前连接到的网络)
    const provider = new ethers.BrowserProvider(window.ethereum);
    // 从provider中获取签名人，就是你当前连接的钱包账户
    const signer = await provider.getSigner();
    console.log(signer);
    // 获取abi和合约地址
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("send eth: ", ethAmount);
    try {
      const txResponse = await contract.fund({
        value: ethAmount,
      });
      //   console.log(txResponse);
      // 接下来要监听交易状态
      await listenForTransactionMine(txResponse, provider);
      console.log("Done!");
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("MetaMask is not installed!");
  }
}

function listenForTransactionMine(txResponse, provider) {
  // 获取这次交易的hash
  console.log(`Mining ${txResponse.hash}`);
  return new Promise((resolve, reject) => {
    // 监听交易状态，使用provider，once代表只触发一次
    provider.once(txResponse.hash, (receipt) => {
      console.log(`completed with ${receipt.status} confirmations`);
      resolve();
    });
  });
}

async function getBalance() {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.formatEther(balance));
  } else {
    console.log("MetaMask is not installed!");
  }
}

async function withdraw() {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const txResponse = await contract.withdraw();
    await listenForTransactionMine(txResponse, provider);
    console.log("Done!");
  } else {
    console.log("MetaMask is not installed!");
  }
}
