"use client";

import React, { useState, useEffect } from "react";
import { EscrowList } from "../components/EscrowList";
import CreateEscrowModal from "../components/CreateEscrowModal";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useEscrows } from "@/lib/hooks/useEscrows";
import { useWatchEscrowEscrowCreatedEvent } from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";

export default function Home() {
  const { address: account, isConnected } = useAccount();
  const { escrows, isLoading, refetch } = useEscrows();
  const [mounted, setMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-refetch escrows when events are fired
  useWatchEscrowEscrowCreatedEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    onLogs() {
      refetch();
    },
  });

  if (!mounted) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading escrows...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isConnected || !account ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to PayMe</h1>
          <p className="text-xl mb-8">Connect your wallet to get started</p>
        </div>
      ) : (
        <>

        {/* Gas Fee Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <div className="text-blue-400 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-300">Network Gas Fees</h3>
            <p className="text-sm text-slate-400 mt-1">
              Regardless of whether you use ETH, USDC, or USDT for the escrow, you will always need a small amount of <strong>Native ETH</strong> in your wallet to pay for network gas fees. 
            </p>
          </div>
        </div>
        
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Escrows</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded font-bold cursor-pointer"
            >
              Create Escrow
            </motion.button>
          </div>

          {isLoading ? (
            <p>Loading escrows...</p>
          ) : (
            <EscrowList escrows={escrows} account={account} />
          )}
        </>
      )}

      <CreateEscrowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
