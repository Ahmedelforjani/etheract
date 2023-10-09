import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { useState, useMemo } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { createPublicClient, http, parseEther } from "viem";

import {
  Address,
  ContractItemType,
  ReadContractItemTypeAbi,
  WriteContractItemTypeAbi,
} from "@/types";
import ContractMethodResult from "./contract-method-result";
import { Loader2 } from "lucide-react";
import useStore from "@/store";
import { supportedChains } from "@/config";

type ParamType = bigint | Address | string | undefined;

export default function ContractMethodItem({
  index,
  item,
}: {
  index: number;
  item: ReadContractItemTypeAbi | WriteContractItemTypeAbi;
}) {
  const { isConnected } = useAccount();
  const network = useNetwork();
  const currentContract = useStore(
    (state) => state.currentContract
  ) as ContractItemType;

  const chain = useMemo(
    () => supportedChains.find((c) => c.id === currentContract?.chainId),
    [currentContract]
  );

  const publicClient = useMemo(
    () =>
      chain &&
      createPublicClient({
        chain: chain,
        transport: http(),
      }),
    [chain]
  );
  const { data: walletClient } = useWalletClient();
  const { open } = useWeb3Modal();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown | undefined>(undefined);
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [ethValue, setEthValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ParamType[]>([]);
  const isReadMethod = item.stateMutability === "view";

  const readMethod = async (item: ReadContractItemTypeAbi) => {
    if (!currentContract) return;
    const response = await publicClient?.readContract({
      abi: currentContract.abi,
      address: currentContract.address,
      functionName: item.name,
      args: params,
    });
    setResult(response);
  };

  const writeMethod = async (item: WriteContractItemTypeAbi) => {
    if (!currentContract) return;

    const value =
      item.stateMutability === "payable" && ethValue
        ? parseEther(ethValue)
        : undefined;

    const response = await walletClient?.writeContract({
      abi: currentContract.abi,
      address: currentContract.address,
      functionName: item.name,
      args: params,
      value: value,
    });

    setHash(response);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;
    if (!isReadMethod && !walletClient) return open();

    setError(null);
    setResult(undefined);
    setLoading(true);

    try {
      if (isReadMethod) {
        await readMethod(item);
      } else {
        await writeMethod(item);
      }
    } catch (err: any) {
      console.log(err);
      setError(
        err?.walk?.()?.shortMessage ||
          err?.walk?.()?.message ||
          err.message ||
          "something went wrong, please try again later"
      );
    }

    setLoading(false);
  };

  const onInputChange = (value: string, index: number) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };
  return (
    <AccordionItem value={`contract-method-${index}`}>
      <AccordionTrigger>
        {index + 1}. {item.name}
      </AccordionTrigger>
      <AccordionContent>
        <form onSubmit={submit} className="flex flex-col items-start gap-6">
          {(!!item.inputs.length || item.stateMutability === "payable") && (
            <div className="flex flex-col items-center w-full gap-2 p-1">
              {item.stateMutability === "payable" && (
                <Input
                  placeholder={`payableAmount (${chain?.nativeCurrency.symbol})`}
                  onChange={(e) => setEthValue(e.target.value)}
                />
              )}
              {item.inputs.map((input, index) => (
                <Input
                  key={index}
                  placeholder={`${input.name || "<input>"} (${input.type})`}
                  onChange={(e) => onInputChange(e.target.value, index)}
                  required
                />
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              size={"sm"}
              disabled={
                loading ||
                (!isConnected && !isReadMethod) ||
                network.chain?.id !== currentContract.chainId
              }
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isReadMethod ? "Query" : "Write"}
            </Button>
            {!isReadMethod && !!hash && (
              <a
                href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
                target="_blank"
              >
                <Button type="button" size={"sm"}>
                  View your transaction
                </Button>
              </a>
            )}
          </div>

          {isReadMethod && (
            <>
              <blockquote className="flex items-center gap-2 pl-4 italic border-l-2">
                {item.outputs.map((output, index) => (
                  <Badge key={index} variant="secondary">
                    {output.type}
                  </Badge>
                ))}
              </blockquote>

              {<ContractMethodResult result={result} itemAbi={item} />}
            </>
          )}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
