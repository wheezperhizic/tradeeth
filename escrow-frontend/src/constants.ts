// constants.ts
export const CONTRACT_ADDRESS = "0xD28F8E5A9fFc756c9b77b6a855f44288CD7c979a"; // REPLACE THIS AFTER DEPLOYING

// Supported Tokens
export const TOKENS = {
  NATIVE: {
    address: "0x0000000000000000000000000000000000000000", // 0x0 means Native ETH/MATIC
    symbol: "ETH",
    decimals: 18,
  },
  USDC: {
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Example Sepolia USDC
    symbol: "USDC",
    decimals: 6,
  },
  USDT: {
    address: "0x0F3a990cdDb2f3675372250a0D849B53528E60f8", // Example Sepolia USDT
    symbol: "USDT",
    decimals: 6,
  }
};