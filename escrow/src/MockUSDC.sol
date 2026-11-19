// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        // Mint 1,000,000 USDC to the deployer (you)
        // USDC uses 6 decimals, so we multiply by 10**6
        _mint(msg.sender, 1000000 * 10**6);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6; // USDC has 6 decimals, not 18!
    }
}