"use client";

import Blockies from "react-blockies";
import { ContractItemType } from "@/types";
import { supportedChains } from "@/config";
import Link from "next/link";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";

type Props = {
  item: ContractItemType;
  remove: (item: ContractItemType) => void;
};
export default function ContractItem({ item, remove }: Props) {
  const chain = supportedChains.find((c) => c.id === item.chainId);
  const link = `/${item.chainId}/${item.address}`;
  return (
    <div
      key={item.id}
      className="flex items-center px-4 py-4 space-x-4 transition-all rounded-md hover:bg-accent hover:text-accent-foreground"
    >
      <Link href={link}>
        <Blockies
          seed={item.address}
          size={16}
          scale={3}
          bgColor="var(--primary)"
          className="rounded-full hover:opacity-80"
        />
      </Link>
      <Link href={link} className="flex flex-col hover:text-primary">
        <span className="font-semibold">
          {item.name} ({chain?.name})
        </span>
        <span className="sm text-muted-foreground truncate text-sm">
          {item.address}
        </span>
      </Link>
      <div className="!ml-auto">
        <Button size={"icon"} variant={"ghost"}>
          <TrashIcon size={16} onClick={() => remove(item)} />
        </Button>
      </div>
    </div>
  );
}
