import {
  arbitrum,
  avalanche,
  bsc,
  bscTestnet,
  fantom,
  goerli,
  polygon,
  mainnet,
  localhost,
  moonriver,
  sepolia,
  Chain,
} from "viem/chains";

export const supportedChains = [
  mainnet,
  bsc,
  polygon,
  arbitrum,
  fantom,
  avalanche,
  moonriver,

  // testnet
  sepolia,
  bscTestnet,
  goerli,
  localhost,
] as Chain[];
