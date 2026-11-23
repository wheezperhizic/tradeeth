// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status { Created, Funded, ServiceRendered, Completed, Disputed }

    struct EscrowDetail {
        address payable buyer;
        address payable seller;
        uint256 amount;
        address tokenAddress; // address(0) means Native Coin (ETH/MATIC)
        Status status;
    }

    address public admin;
    uint256 public platformFeePercent = 2; // Default 2% fee
    mapping(address => uint256) public minEscrowAmount;
    mapping(uint256 => EscrowDetail) public escrows;
    uint256 public escrowCount;

    event EscrowCreated(uint256 indexed escrowId, address buyer, address seller, uint256 amount, address tokenAddress);
    event EscrowFunded(uint256 indexed escrowId);
    event ServiceRendered(uint256 indexed escrowId);
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowDisputed(uint256 indexed escrowId);
    event EscrowSettled(uint256 indexed escrowId, address winner);
    event FeeUpdated(uint256 newFee);
    event MinAmountUpdated(address token, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
    admin = msg.sender;
    
    // Default minimum amounts
    minEscrowAmount[address(0)] = 0.01 ether; // 0.01 ETH
    minEscrowAmount[0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238] = 10 * 10**6; // 10 USDC
    minEscrowAmount[0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0] = 10 * 10**6; // 10 USDT
    }

    function setFee(uint256 _newFee) external onlyAdmin {
    require(_newFee <= 10, "Fee cannot exceed 10%");
    platformFeePercent = _newFee;
    emit FeeUpdated(_newFee); // <--- ADD THIS LINE
    }

    function setMinAmount(address _token, uint256 _amount) external onlyAdmin {
    minEscrowAmount[_token] = _amount;
    emit MinAmountUpdated(_token, _amount);
    }

    // UPDATED: Now accepts ERC20 tokens OR Native Coins
    function createEscrow(address payable _seller, address _tokenAddress, uint256 _amount) external payable nonReentrant returns (uint256) {
        if (_tokenAddress == address(0)) {
            // Native Coin (ETH/MATIC)
            require(msg.value == _amount && _amount >= minEscrowAmount[address(0)], "Amount below minimum");
        } else {
            // ERC20 Token
            require(msg.value == 0, "Do not send native value for ERC20");
            require(_amount >= minEscrowAmount[_tokenAddress], "Amount below minimum");
            // Transfer tokens from buyer to this contract
            IERC20(_tokenAddress).safeTransferFrom(msg.sender, address(this), _amount);
        }

        escrowCount++;
        escrows[escrowCount] = EscrowDetail({
            buyer: payable(msg.sender),
            seller: _seller,
            amount: _amount,
            tokenAddress: _tokenAddress,
            status: Status.Funded
        });

        emit EscrowCreated(escrowCount, msg.sender, _seller, _amount, _tokenAddress);
        return escrowCount;
    }

    // Removed fundEscrow() because funds are locked directly in createEscrow.
    // If you need a two-step process, let me know, but direct funding is safer.

    function renderService(uint256 _escrowId) external nonReentrant {
        EscrowDetail storage escrow = escrows[_escrowId];
        require(escrow.status == Status.Funded, "Escrow is not in Funded status");
        require(msg.sender == escrow.seller, "Only seller can render service");

        escrow.status = Status.ServiceRendered;
        emit ServiceRendered(_escrowId);
    }

    function releaseFunds(uint256 _escrowId) external nonReentrant {
    EscrowDetail storage escrow = escrows[_escrowId];
    require(escrow.status == Status.ServiceRendered, "Escrow is not in ServiceRendered status");
    require(msg.sender == escrow.buyer, "Only buyer can release funds");

    uint256 feeAmount = (escrow.amount * platformFeePercent) / 100;
    uint256 sellerAmount = escrow.amount - feeAmount;

    // 1. UPDATE STATUS & EMIT EVENT FIRST
    escrow.status = Status.Completed;
    emit EscrowCompleted(_escrowId);

    // 2. THEN SEND THE MONEY
    _transferFunds(escrow.tokenAddress, payable(admin), feeAmount);
    _transferFunds(escrow.tokenAddress, escrow.seller, sellerAmount);
    }

    function openDispute(uint256 _escrowId) external nonReentrant {
        EscrowDetail storage escrow = escrows[_escrowId];
        
        if (msg.sender == escrow.buyer) {
            require(escrow.status == Status.Funded || escrow.status == Status.ServiceRendered, "Invalid status for buyer dispute");
        } else if (msg.sender == escrow.seller) {
            require(escrow.status == Status.ServiceRendered, "Invalid status for seller dispute");
        } else {
            revert("Only buyer or seller can open dispute");
        }

        escrow.status = Status.Disputed;
        emit EscrowDisputed(_escrowId);
    }

    function settleDispute(uint256 _escrowId, address payable _winner) external nonReentrant onlyAdmin {
    EscrowDetail storage escrow = escrows[_escrowId];
    require(escrow.status == Status.Disputed, "Escrow is not in Disputed status");

    uint256 feeAmount = (escrow.amount * platformFeePercent) / 100;
    uint256 winnerAmount = escrow.amount - feeAmount;

    // 1. UPDATE STATUS & EMIT EVENT FIRST
    escrow.status = Status.Completed;
    emit EscrowSettled(_escrowId, _winner);

    // 2. THEN SEND THE MONEY
    _transferFunds(escrow.tokenAddress, payable(admin), feeAmount);
    _transferFunds(escrow.tokenAddress, _winner, winnerAmount);
    }

    // Internal helper function to handle both ERC20 and Native transfers safely
    function _transferFunds(address _tokenAddress, address payable _to, uint256 _amount) internal {
        if (_amount == 0) return;

        if (_tokenAddress == address(0)) {
            // Native transfer
            // forge-lint: disable-next-line(arbitrary-send-eth)
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "Native transfer failed");
        } else {
            // ERC20 transfer
            IERC20(_tokenAddress).safeTransfer(_to, _amount);
        }
    }
}