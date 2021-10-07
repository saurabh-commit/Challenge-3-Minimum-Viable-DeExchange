// require('dotenv').config();
// const fs = require("fs");
// require("@nomiclabs/hardhat-waffle");

const { usePlugin } = require('@nomiclabs/buidler/config')
usePlugin("@nomiclabs/buidler-truffle5");

const DEBUG = true

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await web3.eth.getAccounts();
  for (const account of accounts) {
    console.log(account);
  }
});

task("blockNumber", "Prints the block number", async () => {
  const blockNumber = await web3.eth.getBlockNumber();
  console.log(blockNumber)
});

task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs) => {
  const balance = await web3.eth.getBalance(await addr(taskArgs.account))
  console.log(web3.utils.fromWei(balance, "ether"), "ETH");
});

task("send", "Send ETH")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")

  .setAction(async (taskArgs) => {

    let from = await addr(taskArgs.from)
    debug(`Normalized from address: ${from}`)


    let to
    if(taskArgs.to){
        to = await addr(taskArgs.to)
        debug(`Normalized to address: ${to}`)
    }

    let txparams = {
        from: from,
        to: to,
        value: web3.utils.toWei(taskArgs.amount?taskArgs.amount:"0", "ether"),
        gasPrice: web3.utils.toWei(taskArgs.gasPrice?taskArgs.gasPrice:"1.001", "gwei"),
        gas: taskArgs.gasLimit?taskArgs.gasLimit:"24000"
    }

    if(taskArgs.data !== undefined) {
      txparams['data'] = taskArgs.data
      debug(`Adding data to payload: ${txparams['data']}`)
    }
    debug((txparams.gasPrice/1000000000)+" gwei")
    debug(JSON.stringify(txparams,null,2))

    return await send(txparams)
});

function send(txparams) {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(txparams,(error, transactionHash) => {
      if(error){
        debug(`Error: ${error}`)
      }
      debug(`transactionHash: ${transactionHash}`)
      //checkForReceipt(2, params, transactionHash, resolve)
    })
  })
}

function debug(text){
  if(DEBUG){
    console.log(text)
  }
}

async function addr(addr) {
  if(web3.utils.isAddress(addr)) {
    return web3.utils.toChecksumAddress(addr)
  } else {
    let accounts = await web3.eth.getAccounts()
    if(accounts[addr] !== undefined) {
      return accounts[addr]
    } else {
      throw(`Could not normalize address: ${addr}`)
    }
  }
}

// function mnemonic() {
//   try {
//     return fs.readFileSync("./mnemonic.txt").toString().trim();
//   } catch (e) {
//     if (defaultNetwork !== "localhost") {
//       console.log(
//         "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
//       );
//     }
//   }
//   return "";
// }

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      // url: 'https://rinkeby.infura.io/v3/2717afb6bf164045b5d5468031b93f87',
      url: 'http://localhost:8545',
      /*accounts: {
        mnemonic: "**SOME MNEMONIC**"
      },*/
    },
  },
  networks: {
    // rinkeby: {
    //   // url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   url: `https://rinkeby.infura.io/v3/6fc2609506e84d5598b047e739516f41`,
    //   // accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    //   accounts: [`0x9E7C593CCf40aB030bfb08D816505B8B55B20712`],
    // },

    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/0x9E7C593CCf40aB030bfb08D816505B8B55B20712", // <---- YOUR INFURA ID! (or it won't work)
      
    //    //    url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXX/eth/rinkeby", // <---- YOUR MORALIS ID! (not limited to infura)

    //   accounts: {
    //     mnemonic: mnemonic(),
    //   },
    // },
  },


  solc: {
    version : "0.6.6",
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
