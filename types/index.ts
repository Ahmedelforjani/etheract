export type AbiObjectType = {
  type: string;
  stateMutability: string;
  name: string;
  inputs: {
    internalType: "address" | "uint256" | "string" | "bytes";
    type: string;
    name: string;
  }[];
  outputs: {
    internalType: "address" | "uint256" | "string" | "bytes";
    type: string;
    name: string;
  }[];
};

export type AbiType = AbiObjectType[];

export type Address = `0x${string}`;

export type ReadContractItemTypeAbi = AbiObjectType & {
  type: "function";
  stateMutability: "view";
};

export type WriteContractItemTypeAbi = AbiObjectType & {
  type: "function";
  stateMutability: "payable" | "nonpayable";
};

export type ContractItemType = {
  id: string;
  name: string;
  chainId: number;
  address: Address;
  abi: AbiType;
};
