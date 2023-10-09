"use client";

import { ContractItemType } from "@/types";
import { useState } from "react";
import useStore from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContractItem from "@/components/contract-item";
import { Button } from "@/components/ui/button";
import { AddContractModal } from "@/components/add-contract-modal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { contracts } = useStore();
  const removeContract = (contract: ContractItemType) => {
    if (!confirm(`Are you sure you want to remove ${contract.name} contract?`))
      return;
    useStore.setState((state) => ({
      contracts: state.contracts.filter((c) => c.id !== contract.id),
    }));
  };
  return (
    <main className="container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold lg:text-2xl text-lg">Contracts List</p>
            <Button onClick={() => setModalOpen(true)}>Add Contract</Button>
          </div>
        </div>
        <Card>
          <CardContent className="px-2 py-2">
            {contracts.length > 0 ? (
              <div className="flex flex-col divide-y">
                {contracts.map((contract) => (
                  <ContractItem
                    item={contract}
                    key={contract.id}
                    remove={removeContract}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                You do not have any contracts yet. Click the button above to add
                one.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <AddContractModal open={modalOpen} setOpen={setModalOpen} />
    </main>
  );
}
