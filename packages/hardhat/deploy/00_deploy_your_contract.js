// deploy/00_deploy_your_contract.js

const { utils } = require("ethers");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  let tokenDeployResult = await deploy("YourContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ utils.parseEther("10000") ],
    log: true,
  });

  const dex = await deploy("YourDEX", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [ tokenDeployResult.address ],
    log: true,
  });

  // const yourContract = await deploy("YourContract");
  const deployerWallet = ethers.provider.getSigner()
  console.log("\n\n deployerWallet \n", deployerWallet);
  const balance  =  await ethers.provider.getBalance("0x22d85e39bDE1D777df05F602B03000CF063B7Bb7");
  console.log("balance", balance)
  const network =  await ethers.provider.getNetwork()
  console.log("network", network)

  // const dex = await deploy("YourDEX",[yourContract.address])
  // const yourToken = await deployments.get("YourToken");
  const token = await ethers.getContractAt("YourContract", tokenDeployResult.address);
  // const result = await token.transfer( "0x9E7C593CCf40aB030bfb08D816505B8B55B20712", ethers.utils.parseEther("1000") );
  // paste in your address here to get 10 balloons on deploy:
  // const result = await token.transfer("0x9E7C593CCf40aB030bfb08D816505B8B55B20712",""+(10*10**18))
  const result = await token.transfer("0x34aA3F359A9D614239015126635CE7732c18fDF3",""+(10*10**18))

  // uncomment to init DEX on deploy:
  console.log("Approving DEX ("+dex.address+") to take Rabbit from main account...")
  await token.approve(dex.address,ethers.utils.parseEther('100'))
  console.log("INIT exchange...")
  const DEX = await ethers.getContractAt("YourDEX", dex.address);
  // await DEX.init(ethers.utils.parseEther('1'),{value:ethers.utils.parseEther('1')})

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};
module.exports.tags = ["YourContract"];
