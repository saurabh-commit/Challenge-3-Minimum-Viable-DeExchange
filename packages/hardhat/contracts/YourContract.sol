pragma solidity ^0.6.7;
//SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourContract is ERC20 {
    constructor() public ERC20("Rabbit", "🐰") {
        // _mint(0x6e92B3775A8459c39d6a4a8C798efB107385572d, 1000 ether);
        _mint(msg.sender,1000*10**18);
    }
}
