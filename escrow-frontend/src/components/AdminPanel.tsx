"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import {
  escrowAbi,
  useReadEscrowAdmin,
  useWriteEscrowSettleDispute,
  useWatchEscrowEscrowSettledEvent,
} from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";
import { useEscrows } from "@/lib/hooks/useEscrows";
import { AdminEscrowList } from "./AdminEscrowList";
import { toast } from "react-hot-toast";

export const AdminPanel: React.FC = () => {
  const { address: account, isConnected } = useAccount();
  const { data: adminAddress, isLoading: isLoadingAdmin } = useReadEscrowAdmin({
    address: CONTRACT_ADDRESS as `0x${string}`,
  });
  const { escrows, isLoading: isLoadingEscrows, refetch } = useEscrows();
  const { writeContractAsync: settleDispute } = useWriteEscrowSettleDispute();
  const [mounted, setMounted] = useState(false);
  const [newFee, setNewFee] = useState<string>("");
  const [newMinETH, setNewMinETH] = useState<string>("");
  const [isUpdatingFee, setIsUpdatingFee] = useState(false);
  const { writeContractAsync } = useWriteContract();
  useEffect(() => {
    setMounted(true);
  }, []);

  useWatchEscrowEscrowSettledEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    onLogs() {
      refetch();
    },
  });

  if (!mounted) {
    return (
      <div className="text-center py-8">Checking admin credentials...</div>
    );
  }

  const isAdmin =
    account &&
    adminAddress &&
    account.toLowerCase() === adminAddress.toLowerCase();

  if (!isConnected || !account) {
    return (
      <div className="bg-slate-950/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-gray-100 mb-2">Access Denied</h2>
        <p className="text-gray-400">
          Please connect your wallet to access the admin panel.
        </p>
      </div>
    );
  }

  if (isLoadingAdmin || isLoadingEscrows) {
    return <div className="text-center py-8">Loading escrow data...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="bg-red-950/10 text-red-400 p-6 rounded-2xl max-w-md mx-auto text-center border border-red-500/20">
        <h2 className="text-xl font-bold mb-2">Unauthorized</h2>
        <p>You do not have administrative access to this system.</p>
      </div>
    );
  }

  const handleSettleDispute = async (escrowId: number, winner: string) => {
    const toastId = toast.loading(
      `Settling dispute for escrow #${escrowId}...`,
    );
    try {
      await settleDispute({
        address: CONTRACT_ADDRESS as `0x${string}`,
        args: [BigInt(escrowId), winner as `0x${string}`],
      });
      // 2. Tell Discord the Admin has made a decision!
      await fetch('/api/notify-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'settled', 
          escrowId: escrowId.toString(), 
          winnerWallet: winner // We pass the winner's address!
        }),
      });
      toast.success(`Dispute for escrow #${escrowId} settled successfully!`, {
        id: toastId,
      });
      refetch();
    } catch (error) {
      console.error("Failed to settle dispute:", error);
      toast.error(`Failed to settle dispute: ${(error as Error).message}`, {
        id: toastId,
      });
    }
  };

  const handleSetFee = async () => {
  if (!newFee) return;
  setIsUpdatingFee(true);
  const toastId = toast.loading("Updating platform fee...");
  
  try {
    await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: escrowAbi,
      functionName: "setFee",
      args: [BigInt(newFee)],
    });
    toast.success(`Fee updated to ${newFee}%!`, { id: toastId });
    setNewFee(""); // clear the input
  } catch (error: any) {
    console.error(error);
    toast.error(error.shortMessage || "Failed to update fee.", { id: toastId });
  } finally {
    setIsUpdatingFee(false);
  }
};
  const handleSetMinETH = async () => {
    if (!newMinETH) return;
    setIsUpdatingFee(true); // Reusing the fee loading state
    const toastId = toast.loading("Updating minimum ETH...");
    
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: escrowAbi,
        functionName: "setMinAmount",
        // 0x000... represents Native ETH. We convert the input to Wei (18 zeros)
        args: ["0x0000000000000000000000000000000000000000", BigInt(Number(newMinETH) * 10**18)],
      });
      toast.success(`Minimum ETH updated to ${newMinETH}!`, { id: toastId });
      setNewMinETH(""); // Clear the input box
    } catch (error: any) {
      console.error(error);
      toast.error(error.shortMessage || "Failed to update minimum.", { id: toastId });
    } finally {
      setIsUpdatingFee(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-100 border-b border-slate-800 pb-4">
        Admin Panel
      </h1>

          {/* Platform Fee Manager */}
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8 mt-6">
      <h2 className="text-xl font-bold text-white mb-2">Platform Fee Settings</h2>
      <p className="text-slate-400 text-sm mb-4">
        Change the fee percentage taken when funds are released (Max 10%).
      </p>
      <div className="flex items-center gap-4">
        <input
          type="number"
          placeholder="e.g. 3"
          value={newFee}
          onChange={(e) => setNewFee(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-white rounded-lg p-3 w-32 focus:outline-none focus:border-blue-500"
          min="0"
          max="10"
        />
        <span className="text-slate-300 font-bold">%</span>
        <button
          onClick={handleSetFee}
          disabled={isUpdatingFee || !newFee}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-colors"
        >
          {isUpdatingFee ? "Updating..." : "Update Fee"}
        </button>
      </div>
    </div>

    {/* Minimum ETH Settings */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Minimum Escrow Limit (ETH)</h2>
        <p className="text-slate-400 text-sm mb-4">
          Set the minimum amount of ETH a user can put into an escrow.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="e.g. 0.01"
            value={newMinETH}
            onChange={(e) => setNewMinETH(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg p-3 w-32 focus:outline-none focus:border-green-500"
          />
          <span className="text-slate-300 font-bold">ETH</span>
          <button
            onClick={handleSetMinETH}
            disabled={isUpdatingFee || !newMinETH}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 transition-colors"
          >
            {isUpdatingFee ? "Updating..." : "Update Min ETH"}
          </button>
        </div>
      </div>
      <AdminEscrowList
        escrows={escrows}
        isAdmin={true}
        onSettleDispute={handleSettleDispute}
      />
    </div>
  );
};
