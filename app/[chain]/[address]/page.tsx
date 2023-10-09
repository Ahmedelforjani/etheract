"use client";

import ConnectWalletButton from "@/components/connect-wallet-button";
import ContractMethodItem from "@/components/contract-method-item";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supportedChains } from "@/config";
import useStore from "@/store";
import { ReadContractItemTypeAbi, WriteContractItemTypeAbi } from "@/types";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

type PageProps = {
  params: {
    chain: string;
    address: string;
  };
};

export default function Page({ params }: PageProps) {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const router = useRouter();
  const currentContract = useStore((state) =>
    state.contracts.find(
      (c) => c.address === params.address && c.chainId === +params.chain
    )
  );
  const chain = useMemo(
    () => supportedChains.find((c) => c.id === currentContract?.chainId),
    [currentContract]
  );
  const initialTab =
    typeof window !== "undefined" ? window.location.hash.slice(1) : null;
  const [activeTab, setActiveTab] = useState(initialTab || "read");

  const readContractItems = useMemo(
    () =>
      currentContract?.abi
        ?.filter(
          (item) => item.type === "function" && item.stateMutability === "view"
        )
        .sort() || [],
    [currentContract?.abi]
  ) as ReadContractItemTypeAbi[];

  const writeContractItems = useMemo(
    () =>
      currentContract?.abi
        ?.filter(
          (item) =>
            item.type === "function" &&
            ["payable", "nonpayable"].includes(item.stateMutability)
        )
        .sort() || [],
    [currentContract?.abi]
  ) as WriteContractItemTypeAbi[];

  const handleTabChange = (value: string) => {
    //update the state
    setActiveTab(value);
    // update the URL query parameter
    window.history.replaceState(null, "", `#${value}`);
  };

  useEffect(() => {
    useStore.setState({ currentContract });
  }, [currentContract]);

  return (
    <main className="container">
      <div className="max-w-3xl mx-auto">
        {currentContract?.id && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => router.back()}
                  size="icon"
                  variant="ghost"
                >
                  <ChevronLeftIcon />
                </Button>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-lg">
                    {currentContract.name} ({chain?.name})
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {currentContract.address}
                  </p>
                </div>
                <Button asChild className="ml-auto">
                  <a
                    href={`${chain?.blockExplorers?.default.url}/address/${params.address}`}
                    target="_blank"
                  >
                    <ExternalLinkIcon size={16} className="mr-2" />
                    <span className="lg:inline hidden">Explorer</span>
                  </a>
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <Tabs
                  defaultValue="read"
                  value={activeTab}
                  onValueChange={handleTabChange}
                >
                  <TabsList>
                    <TabsTrigger value="read">Read Contract</TabsTrigger>
                    <TabsTrigger value="write">Write Contract</TabsTrigger>
                  </TabsList>
                  <div className="w-full mt-6 mb-2 flex items-center gap-4">
                    <ConnectWalletButton />
                    {isConnected &&
                      network.chain?.id !== currentContract.chainId && (
                        <Button
                          onClick={() =>
                            switchNetwork?.(currentContract.chainId)
                          }
                          variant={"outline-primary"}
                          size={"sm"}
                        >
                          Switch to {chain?.name}
                        </Button>
                      )}
                  </div>
                  <>
                    <TabsContent value="read">
                      <Accordion type="multiple">
                        {readContractItems.map((item, index) => (
                          <ContractMethodItem
                            key={index}
                            index={index}
                            item={item}
                          />
                        ))}
                      </Accordion>
                    </TabsContent>
                    <TabsContent value="write">
                      <Accordion type="multiple">
                        {writeContractItems.map((item, index) => (
                          <ContractMethodItem
                            key={index}
                            index={index}
                            item={item}
                          />
                        ))}
                      </Accordion>
                    </TabsContent>
                  </>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
