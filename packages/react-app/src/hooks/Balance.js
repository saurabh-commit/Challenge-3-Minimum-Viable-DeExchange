// import { useCallback, useState, useEffect } from "react";
// import useOnBlock from "./OnBlock";
// import usePoller from "./Poller";

// /*
//   ~ What it does? ~

//   Gets your balance in ETH from given address and provider

//   ~ How can I use? ~

//   const yourLocalBalance = useBalance(localProvider, address);

//   ~ Features ~

//   - Provide address and get balance corresponding to given address
//   - Change provider to access balance on different chains (ex. mainnetProvider)
//   - If no pollTime is passed, the balance will update on every new block
// */

// const DEBUG = false;

// export default function useBalance(provider, address, pollTime = 0) {
//   const [balance, setBalance] = useState(0);

//   const pollBalance = useCallback(
//     async (provider, address) => {
//       if (provider && address) {
//         const newBalance = await provider.getBalance(address);
//         if (newBalance !== balance) {
//           setBalance(newBalance);
//         }
//       }
//     },
//     [provider, address],
//   );

//   // Only pass a provider to watch on a block if there is no pollTime
//   // useOnBlock(pollTime === 0 && provider, () => {
//   //   if (provider && address && pollTime === 0) {
//   //     pollBalance(provider, address);
//   //   }
//   // });

//   // Update balance when the address or provider changes
//   useEffect(() => {
//     if (address && provider) pollBalance(provider, address);
//   }, [address, provider, pollBalance]);

//   // Use a poller if a pollTime is provided
//   usePoller(
//     async () => {
//       if (provider && address && pollTime > 0) {
//         if (DEBUG) console.log("polling!", address);
//         pollBalance();
//       }
//     },
//     pollTime,
//     provider && address,
//   );

//   return balance;
// }

import { useState } from 'react';
import usePoller from "./Poller.js";
import { ethers } from "ethers";
export default function useBalance(address,provider,pollTime) {

  const [balance, setBalance] = useState(0);
  const pollBalance = async ()=>{
    if(address && (provider && typeof(provider) != 'string')){
      console.log("typeof(provider):", typeof(provider))
      console.log("getPrototypeOf(provider)", Object.getPrototypeOf(provider))
      console.log("address:", address); 
      console.log(" provider:", provider);
      // console.log(" provider.getBalance(address):", await provider.getBalance(address));
      let newBalance = await provider.getBalance(address)
      // let newBalance = await address.getBalance(provider) 
      if(newBalance!==balance){
        //console.log("NEW BALANCE:",newBalance,"Current balance",balance)
        setBalance(newBalance)
      }
    }
  }
  usePoller(pollBalance,pollTime?pollTime:777)

  return balance;
}
