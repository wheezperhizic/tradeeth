import { useReadEscrowEscrowCount, escrowAbi } from "@/lib/generated";
import { CONTRACT_ADDRESS } from "@/constants";
import { useReadContracts } from "wagmi";
import { Escrow } from "@/types";
import { formatUnits } from "viem";
import { TOKENS } from "@/constants";

export function useEscrows() {
  const {
    data: count,
    refetch: refetchCount,
    isLoading: isLoadingCount,
  } = useReadEscrowEscrowCount({
    address: CONTRACT_ADDRESS as `0x${string}`,
  });

  const countNumber = count ? Number(count) : 0;

  // Build contract read requests for each escrow index (1-based index)
  const contracts = Array.from({ length: countNumber }, (_, i) => ({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: escrowAbi,
    functionName: "escrows",
    args: [BigInt(i + 1)],
  }));

  const {
    data: escrowsData,
    refetch: refetchEscrows,
    isLoading: isLoadingEscrows,
  } = useReadContracts({
    contracts,
    query: {
      enabled: countNumber > 0,
    },
  });

  const escrows: Escrow[] = [];
if (escrowsData) {
  escrowsData.forEach((res, index) => {
    if (res.status === "success" && res.result) {
      const rawData = res.result as any;
      
      const buyer = rawData[0] || rawData.buyer;
      const seller = rawData[1] || rawData.seller;
      const amountRaw = rawData[2] || rawData.amount;
      const tokenAddress = rawData[3] || rawData.tokenAddress;
      const statusNum = Number(rawData[4] !== undefined ? rawData[4] : rawData.status);

      // Figure out if this is ETH (18 decimals) or USDC (6 decimals)
      // Figure out the decimals and symbol dynamically
        let formattedAmount = "";
        let symbol = "ETH";

        if (!tokenAddress || tokenAddress === "0x0000000000000000000000000000000000000000") {
          formattedAmount = formatUnits(amountRaw, 18);
          symbol = "ETH";
        } else {
          // Find the token in our TOKENS config object dynamically
          const foundToken = Object.values(TOKENS).find(
            (t) => t.address.toLowerCase() === tokenAddress.toLowerCase()
          );
          
          if (foundToken) {
            formattedAmount = formatUnits(amountRaw, foundToken.decimals);
            symbol = foundToken.symbol;
          } else {
            // Fallback just in case it's a token not in our list
            formattedAmount = formatUnits(amountRaw, 18); 
            symbol = "TOKEN";
          }
        }

      escrows.push({
        id: index + 1,
        buyer,
        seller,
        amount: `${formattedAmount} ${symbol}`, // e.g., "500 USDC" or "20 ETH"
        status: [
          "Created",
          "Funded",
          "ServiceRendered",
          "Completed",
          "Disputed",
        ][statusNum] as Escrow["status"],
      });
    }
  });
}

  const refetch = async () => {
    await refetchCount();
    if (countNumber > 0) {
      await refetchEscrows();
    }
  };

  return {
    escrows,
    isLoading: isLoadingCount || isLoadingEscrows,
    refetch,
  };
}
