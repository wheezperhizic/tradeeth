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
  {"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"admin","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"createEscrow","inputs":[{"name":"_seller","type":"address","internalType":"address payable"},{"name":"_tokenAddress","type":"address","internalType":"address"},{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"payable"},{"type":"function","name":"escrowCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"escrows","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"buyer","type":"address","internalType":"address payable"},{"name":"seller","type":"address","internalType":"address payable"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"tokenAddress","type":"address","internalType":"address"},{"name":"status","type":"uint8","internalType":"enum Escrow.Status"}],"stateMutability":"view"},{"type":"function","name":"openDispute","inputs":[{"name":"_escrowId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"platformFeePercent","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"releaseFunds","inputs":[{"name":"_escrowId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"renderService","inputs":[{"name":"_escrowId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFee","inputs":[{"name":"_newFee","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"settleDispute","inputs":[{"name":"_escrowId","type":"uint256","internalType":"uint256"},{"name":"_winner","type":"address","internalType":"address payable"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"EscrowCompleted","inputs":[{"name":"escrowId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"EscrowCreated","inputs":[{"name":"escrowId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"buyer","type":"address","indexed":false,"internalType":"address"},{"name":"seller","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"tokenAddress","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"EscrowDisputed","inputs":[{"name":"escrowId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"EscrowFunded","inputs":[{"name":"escrowId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"EscrowSettled","inputs":[{"name":"escrowId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"winner","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"FeeUpdated","inputs":[{"name":"newFee","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ServiceRendered","inputs":[{"name":"escrowId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]},{"type":"error","name":"SafeERC20FailedOperation","inputs":[{"name":"token","type":"address","internalType":"address"}]}
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
