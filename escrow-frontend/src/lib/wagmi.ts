import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains"; // <-- We use Sepolia now, not Anvil

// Fetch the project ID from environment variables.
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID || "b1fad54365121aeb4cb8ea89539026df"; // Keep your existing ID here

if (!process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
  console.warn(
    "Wagmi Warning: NEXT_PUBLIC_WC_PROJECT_ID is not configured in environment variables."
  );
}

export const config = getDefaultConfig({
  appName: "PayMe",
  projectId: walletConnectProjectId,
  
  // 1. Tell Wagmi to use the Sepolia testnet
  chains: [sepolia], 
  
  transports: {
    // 2. Give it the Alchemy URL to talk to the Sepolia network
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/alch_BBYWr_EyELzeHf05BFu3a"), 
  },
  
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  ssr: true,
});