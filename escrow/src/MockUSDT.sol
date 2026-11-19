// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "USDT") {
        // Mint 1,000,000 USDT to the deployer
        _mint(msg.sender, 1000000 * 10**6);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6; // USDT uses 6 decimals
    }
}