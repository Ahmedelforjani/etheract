import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { supportedChains } from "@/config";
import useStore from "@/store";
import { generateUuid } from "@/lib/utils";
import { isAddress } from "viem";
import { AbiType, Address, ContractItemType } from "@/types";
import { useToast } from "./ui/use-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function AddContractModal({ open, setOpen }: Props) {
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let error = null;
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
      JSON.parse(`${values.abi}`);
    } catch (e) {
      error = "Invalid ABI";
    }

    if (!isAddress(`${values.address}`)) {
      error = "Invalid address";
    }

    if (error) {
      toast({ title: error, variant: "destructive" });
      return;
    }

    const newContract: ContractItemType = {
      id: generateUuid(),
      name: `${values.name}`,
      address: `${values.address}` as Address,
      abi: JSON.parse(`${values.abi}`) as AbiType,
      chainId: +values.chainId,
    };

    useStore.setState((state) => ({
      contracts: [newContract, ...state.contracts],
    }));

    toast({ title: "Contract added successfully" });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Contract</DialogTitle>
          <DialogDescription>
            Add a new contract to your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-3">
            <Label htmlFor="chainId">Chain</Label>
            <Select name="chainId" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a chain" />
              </SelectTrigger>
              <SelectContent>
                {supportedChains.map((chain) => (
                  <SelectItem key={chain.id} value={`${chain.id}`}>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Contract Name</Label>
            <Input id="name" name="name" className="col-span-3" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="abi">ABI (JSON format)</Label>
            <Textarea
              rows={6}
              id="abi"
              name="abi"
              className="col-span-3"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
