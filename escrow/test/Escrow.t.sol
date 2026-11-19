// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Escrow} from "../src/Escrow.sol";

contract EscrowTest is Test {
    Escrow public escrow;
    address payable public buyer;
    address payable public seller;

    function setUp() public {
        escrow = new Escrow();
        buyer = payable(makeAddr("buyer"));
        seller = payable(makeAddr("seller"));
        
        // Give buyer 10 ether to test with
        vm.deal(buyer, 10 ether);
    }

    function test_NativeEscrowFlow() public {
        // 1. Buyer creates and funds the escrow
        vm.startPrank(buyer);
        // Note the 3 arguments: seller, tokenAddress (address(0) for ETH), amount
        uint256 escrowId = escrow.createEscrow{value: 1 ether}(seller, address(0), 1 ether);
        vm.stopPrank();

        // 2. Verify the escrow details
        // Note there are now 5 variables to unpack from the struct
        (
            address payable _buyer, 
            address payable _seller, 
            uint256 amount, 
            address tokenAddress, 
            Escrow.Status status
        ) = escrow.escrows(escrowId);

        assertEq(_buyer, buyer);
        assertEq(_seller, seller);
        assertEq(amount, 1 ether);
        assertEq(tokenAddress, address(0));
        assertEq(uint(status), uint(Escrow.Status.Funded));
    }
}