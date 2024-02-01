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
    // 想要用钱包发送一个交易，需要的内容
    // provider RPC节点服务提供者
    // signer / wallet 发送交易的签名人或钱包
    // contract 可以交互的合约(需要知道ABI和合约地址)
  } else {
    console.log("MetaMask is not installed!");
  }
}
