"use client";

import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { WalletIcon } from "lucide-react";

export default function ConnectWalletButton() {
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <Button onClick={() => open()} size={"sm"}>
      <WalletIcon className="lg:mr-2" size={16} />

      {address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
}
