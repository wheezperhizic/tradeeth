"use client";

import { useState } from "react";
import { parseUnits, erc20Abi } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { escrowAbi } from "@/lib/generated";
import { CONTRACT_ADDRESS, TOKENS } from "@/constants";

interface CreateEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Optional: to refresh the list after creation
}

export default function CreateEscrowModal({ isOpen, onClose, onSuccess }: CreateEscrowModalProps) {
  const { address } = useAccount();
  
  // Form state
  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<keyof typeof TOKENS>("NATIVE");
  
  const tokenInfo = TOKENS[selectedToken];

  // Web3 state
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const [isApproved, setIsApproved] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleApprove = async () => {
    if (!amount) return;
    setIsApproved(false); // <--- Reset Approval state if they try again
    setStatus(`Approving ${tokenInfo.symbol}...`);
    try {
      const parsedAmount = parseUnits(amount, tokenInfo.decimals);
      
      await writeContractAsync({
        address: tokenInfo.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [CONTRACT_ADDRESS as `0x${string}`, parsedAmount],
      });
      setStatus("Approval successful! You can now create the escrow.");
      setIsApproved(true); // <--- Add this here!
    } catch (error: any) {
      console.error(error);
      setStatus(error.shortMessage || "Approval failed.");
      setIsApproved(false); // <--- Keep the Approve button visible if it fails
    }
  };

  const handleCreate = async () => {
    if (!seller || !amount) {
      setStatus("Please enter a seller address and amount.");
      return;
    }

    // Add this block right below the if (!seller || !amount) check
    const numAmount = Number(amount);
    if (selectedToken === "NATIVE" && numAmount < 0.01) {
      setStatus("Minimum escrow amount is 0.01 ETH to cover network fees.");
      return;
    }
    if (selectedToken !== "NATIVE" && numAmount < 10) {
      setStatus(`Minimum escrow amount is 10 ${tokenInfo.symbol} to cover network fees.`);
      return;
    }

    setStatus(`Creating Escrow with ${tokenInfo.symbol}...`);

    try {
      const parsedAmount = parseUnits(amount, tokenInfo.decimals);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: escrowAbi,
        functionName: "createEscrow",
        args: [
          seller as `0x${string}`, 
          tokenInfo.address as `0x${string}`, 
          parsedAmount
        ],
        value: selectedToken === "NATIVE" ? parsedAmount : undefined,
      });

      setTxHash(hash);
      setStatus("Waiting for blockchain confirmation...");
    } catch (error: any) {
      console.error("Transaction Error:", error);
      setStatus(error.shortMessage || "Transaction failed or rejected.");
      setTxHash(undefined);
    }
  };

  // Handle successful transaction
  if (isSuccess && txHash) {
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
      // Reset form
      setSeller("");
      setAmount("");
      setStatus("");
      setTxHash(undefined);
    }, 2000);
  }

  if (!isOpen) {
    // Reset approval state when the modal is closed
    if (isApproved) setIsApproved(false);
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-slate-900 rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Escrow</h2>

        {isSuccess ? (
          <div className="text-center p-6 bg-green-100 text-green-700 rounded-lg">
            <h3 className="text-xl font-bold mb-2">✅ Success!</h3>
            <p>Escrow created successfully.</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium mb-1">Seller Address</label>
              <input 
                type="text" 
                placeholder="0x..." 
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input 
                type="number" 
                placeholder="0.0" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1 text-left">
                Minimum: {selectedToken === "NATIVE" ? "0.01 ETH" : `10 ${tokenInfo.symbol}`}
              </p>
            </div>

            {/* Token Selector */}
            <div>
              <label className="block text-sm font-medium mb-1">Payment Token</label>
              <select 
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value as keyof typeof TOKENS)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="NATIVE">Native Coin (ETH)</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
              </select>
            </div>

            {status && <p className="text-sm text-center text-blue-600 font-medium">{status}</p>}

            {/* Approve Button (ERC20 only) */}
            {selectedToken !== "NATIVE" && !isApproved && (
              <button 
                onClick={handleApprove}
                disabled={isConfirming}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded disabled:opacity-50 mb-3"
              >
                Step 1: Approve {tokenInfo.symbol}
              </button>
            )}

            {/* Create Button */}
            <button 
              onClick={handleCreate}
              disabled={isConfirming || status.includes("ing")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50"
            >
              {isConfirming ? "Waiting for confirmation..." : (selectedToken !== "NATIVE" ? `Step 2: Create Escrow with ${tokenInfo.symbol}` : "Create Escrow")}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}