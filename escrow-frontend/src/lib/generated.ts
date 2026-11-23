import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Escrow
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const escrowAbi = [
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_seller",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "createEscrow",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "EscrowCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "EscrowCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "EscrowDisputed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "EscrowFunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"name": "EscrowSettled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			}
		],
		"name": "FeeUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "MinAmountUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_escrowId",
				"type": "uint256"
			}
		],
		"name": "openDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_escrowId",
				"type": "uint256"
			}
		],
		"name": "releaseFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_escrowId",
				"type": "uint256"
			}
		],
		"name": "renderService",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "ServiceRendered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newFee",
				"type": "uint256"
			}
		],
		"name": "setFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "setMinAmount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_escrowId",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_winner",
				"type": "address"
			}
		],
		"name": "settleDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "escrowCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "escrows",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "buyer",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "enum Escrow.Status",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "minEscrowAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformFeePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__
 */
export const useReadEscrow = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"admin"`
 */
export const useReadEscrowAdmin = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
  functionName: 'admin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"escrowCount"`
 */
export const useReadEscrowEscrowCount = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
  functionName: 'escrowCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"escrows"`
 */
export const useReadEscrowEscrows = /*#__PURE__*/ createUseReadContract({
  abi: escrowAbi,
  functionName: 'escrows',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__
 */
export const useWriteEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"createEscrow"`
 */
export const useWriteEscrowCreateEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
  functionName: 'createEscrow',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"fundEscrow"`
 */
/*export const useWriteEscrowFundEscrow = /*#__PURE__*/ /*createUseWriteContract({
/*  abi: escrowAbi,
 /* functionName: 'fundEscrow',
/*})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"openDispute"`
 */
export const useWriteEscrowOpenDispute = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
  functionName: 'openDispute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"releaseFunds"`
 */
export const useWriteEscrowReleaseFunds = /*#__PURE__*/ createUseWriteContract({
  abi: escrowAbi,
  functionName: 'releaseFunds',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"renderService"`
 */
export const useWriteEscrowRenderService = /*#__PURE__*/ createUseWriteContract(
  { abi: escrowAbi, functionName: 'renderService' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"settleDispute"`
 */
export const useWriteEscrowSettleDispute = /*#__PURE__*/ createUseWriteContract(
  { abi: escrowAbi, functionName: 'settleDispute' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__
 */
export const useSimulateEscrow = /*#__PURE__*/ createUseSimulateContract({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"createEscrow"`
 */
export const useSimulateEscrowCreateEscrow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'createEscrow',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"fundEscrow"`
 */
/*export const useSimulateEscrowFundEscrow =
  /*#__PURE__*/ /*createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'fundEscrow',
  })*/

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"openDispute"`
 */
export const useSimulateEscrowOpenDispute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'openDispute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"releaseFunds"`
 */
export const useSimulateEscrowReleaseFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'releaseFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"renderService"`
 */
export const useSimulateEscrowRenderService =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'renderService',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link escrowAbi}__ and `functionName` set to `"settleDispute"`
 */
export const useSimulateEscrowSettleDispute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: escrowAbi,
    functionName: 'settleDispute',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__
 */
export const useWatchEscrowEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: escrowAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowCompleted"`
 */
export const useWatchEscrowEscrowCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowCompleted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowCreated"`
 */
export const useWatchEscrowEscrowCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowDisputed"`
 */
export const useWatchEscrowEscrowDisputedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowDisputed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowFunded"`
 */
export const useWatchEscrowEscrowFundedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowFunded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"EscrowSettled"`
 */
export const useWatchEscrowEscrowSettledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'EscrowSettled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link escrowAbi}__ and `eventName` set to `"ServiceRendered"`
 */
export const useWatchEscrowServiceRenderedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: escrowAbi,
    eventName: 'ServiceRendered',
  })
