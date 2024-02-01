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
