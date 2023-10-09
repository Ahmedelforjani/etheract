import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ContractItemType } from "@/types";

type StateType = {
  contracts: ContractItemType[];
  currentContract?: ContractItemType;
};

const initialState: StateType = {
  contracts: [],
};

const useStore = create<StateType>()(
  persist(() => initialState, { name: "etheract" })
);

export default useStore;
