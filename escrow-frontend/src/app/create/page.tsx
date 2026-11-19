"use client";
import { parseEventLogs, parseUnits, erc20Abi } from "viem";
import { escrowAbi } from "@/lib/generated";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, TOKENS } from "@/constants";
import { useState, useEffect, useRef, Suspense } from "react";


function CreateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState("");

  // Add this below your status state on line 13
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const seller = searchParams.get("seller");
  const amount = searchParams.get("amount");

  const { writeContractAsync } = useWriteContract();

  // Add the token selector state
  const [selectedToken, setSelectedToken] = useState<keyof typeof TOKENS>("NATIVE");
  const tokenInfo = TOKENS[selectedToken];
  // --- ADD STEP 4 HERE ---
  const { 
  data: receipt, // 👈 Add this to get the transaction receipt
  isLoading: isConfirming, 
  isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash: txHash });
  
// -----------------------

// Add this ref to prevent double-firing in React Strict Mode
const hasProcessedSuccess = useRef(false);

// ... inside CreateContent ...
  useEffect(() => {
  // We check if receipt exists to ensure we don't try to parse undefined
  if (isConfirmed && receipt && !hasProcessedSuccess.current) {
    hasProcessedSuccess.current = true; 

    const notifyBot = async () => {
      try {
        // 1. Get the real escrowId from the transaction receipt
        let realEscrowId = "Unknown";
        
        if (receipt.logs) {
          const logs = parseEventLogs({
            abi: escrowAbi, 
            eventName: "EscrowCreated",
            logs: receipt.logs,
          });
          
          if (logs.length > 0) {
            // TypeScript might complain about logs[0].args.escrowId, 
            // if so, you can cast it to 'any' or the specific type.
            realEscrowId = (logs[0] as any).args.escrowId.toString();
          }
        }

        // 2. Call YOUR OWN Next.js API route
        await fetch("/api/notify-bot", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            escrowId: realEscrowId, 
            buyerWallet: address,     
            sellerWallet: seller,     
            amount: amount,
            action: "Funded"          
          })
        });
      } catch (error) {
        console.error("Failed to notify Discord bot:", error);
      }
    };

    notifyBot();

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/"); 
    }, 2000);
  }
}, [isConfirmed, receipt, router, seller, amount, address]); // Clean dependency array

const handleApprove = async () => {
  if (!amount) return;
  try {
    setStatus(`Approving ${tokenInfo.symbol}...`);
    const parsedAmount = parseUnits(amount as string, tokenInfo.decimals);
    
    await writeContractAsync({
      address: tokenInfo.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [CONTRACT_ADDRESS as `0x${string}`, parsedAmount],
    });
    setStatus("Approval successful! You can now create the escrow.");
  } catch (error: any) {
    console.error(error);
    setStatus(error.shortMessage || "Approval failed.");
  }
};

    const handlePay = async () => {
      if (!seller || !amount) {
        setStatus("Missing seller or amount parameters.");
        return;
      }

      setStatus(`Creating Escrow with ${tokenInfo.symbol}...`);

      try {
        // This correctly handles 6 decimals for USDC and 18 for ETH
        const parsedAmount = parseUnits(amount as string, tokenInfo.decimals);

        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: escrowAbi,
          functionName: "createEscrow",
          args: [
            seller as `0x${string}`, 
            tokenInfo.address as `0x${string}`, 
            parsedAmount
          ],
          // Only attach ETH value if they selected the Native coin
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

  if (!seller || !amount) {
    return <div className="text-center text-white mt-20">Invalid Link.</div>;
  }

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
    <div className="bg-slate-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
      <h1 className="text-2xl font-bold mb-4">Complete Escrow Payment</h1>
      <p className="mb-2"><strong>Seller:</strong> {seller}</p>
      <p className="mb-6"><strong>Amount:</strong> {amount}</p>

      {!isConnected ? (
        <p className="text-yellow-400">Please connect your wallet using the button in the top right.</p>
      ) : isConfirmed ? (
        <div className="w-full bg-green-600 text-white font-bold py-3 rounded mt-4">
          ✅ Escrow Created and Funded!
        </div>
      ) : (
        <>
          {/* Token Selector Dropdown */}
          <div className="mb-4 mt-6 text-left">
            <label className="block text-sm font-medium mb-1 text-slate-300">Select Payment Token</label>
            <select 
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value as keyof typeof TOKENS)}
              className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-indigo-500"
            >
              <option value="NATIVE">Native Coin (ETH)</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>

          {/* Step 1: Approve Button (Only shows for USDC/USDT) */}
          {selectedToken !== "NATIVE" && (
            <button
              onClick={handleApprove}
              disabled={isConfirming}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded mb-3 disabled:opacity-50"
            >
              Step 1: Approve {tokenInfo.symbol}
            </button>
          )}

          {/* Step 2: Create Escrow Button */}
          <button
            onClick={handlePay}
            disabled={isConfirming || status.includes("ing")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded disabled:opacity-50"
          >
            {isConfirming 
              ? "Waiting for blockchain confirmation..." 
              : (status ? status : (selectedToken !== "NATIVE" ? `Step 2: Create Escrow with ${tokenInfo.symbol}` : "Create Escrow"))}
          </button>
        </>
      )}
    </div>
  </div>
);
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
      <CreateContent />
    </Suspense>
  );
}