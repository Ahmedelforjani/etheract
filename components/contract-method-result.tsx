import { supportedChains } from "@/config";
import useStore from "@/store";
import { ContractItemType, ReadContractItemTypeAbi } from "@/types";
import { useMemo } from "react";
import { isAddress } from "viem";

const weiValueLink = (value: bigint) => {
  const chain = supportedChains.find(
    (c) => c.id === useStore.getState().currentContract?.chainId
  );
  return (
    <a
      href={`${
        chain?.blockExplorers?.default.url
      }/unitconverter?wei=${value.toString()}`}
      target="_blank"
      className="font-semibold text-blue-500 hover:underline"
    >
      {value.toString()}
    </a>
  );
};

const addressValueLink = (value: string) => {
  const chain = supportedChains.find(
    (c) => c.id === useStore.getState().currentContract?.chainId
  );

  return (
    <a
      href={`${chain?.blockExplorers?.default.url}/address/${value}`}
      target="_blank"
      className="font-semibold text-blue-500 hover:underline"
    >
      {value}
    </a>
  );
};

const multiOutputValue = (
  itemAbi: ReadContractItemTypeAbi,
  result: unknown & Array<unknown>
) => (
  <ul>
    {result.map((item, index) => (
      <li key={index}>
        {itemAbi.outputs[index]?.name && (
          <span className="text-sm text-gray-400">
            {itemAbi.outputs[index].name}:{" "}
          </span>
        )}
        {handleResult(itemAbi, item)}
      </li>
    ))}
  </ul>
);

const arrayValue = (
  itemAbi: ReadContractItemTypeAbi,
  result: unknown & Array<unknown>
) => (
  <div>
    [{" "}
    {result.map((item, index) => (
      <span key={index}>
        {handleResult(itemAbi, item)}
        {index < result.length - 1 && ", "}
      </span>
    ))}{" "}
    ]
  </div>
);

const handleResult = (itemAbi: ReadContractItemTypeAbi, result: unknown) => {
  if (itemAbi.outputs.length > 1 && Array.isArray(result))
    return multiOutputValue(itemAbi, result);
  else if (Array.isArray(result)) return arrayValue(itemAbi, result);
  else if (typeof result === "bigint") return weiValueLink(result);
  else if (typeof result === "string" && isAddress(result))
    return addressValueLink(result);
  return <span> {result?.toString()} </span>;
};

export default function ContractMethodResult({
  itemAbi,
  result,
}: {
  itemAbi: ReadContractItemTypeAbi;
  result?: unknown;
}) {
  const currentContract = useStore(
    (state) => state.currentContract
  ) as ContractItemType;

  const chain = useMemo(
    () => supportedChains.find((c) => c.id === currentContract.chainId),
    [currentContract]
  );

  if (result === undefined) return null;

  return (
    <div className="flex flex-col">
      <p className="mb-2 ">
        [ <span className="font-bold"> {itemAbi.name}</span> Method Response ]
      </p>
      {handleResult(itemAbi, result)}
    </div>
  );
}
