import NSEngineAbi from "./abis/NSEngine.abi.json";
import NairaStableAbi from "./abis/NairaStable.abi.json";
import { ENGINE_ADDRESS, NNGN_ADDRESS } from "./constants";

export const engineContract = {
  address: ENGINE_ADDRESS,
  abi: NSEngineAbi,
} as const;

export const ngnContract = {
  address: NNGN_ADDRESS,
  abi: NairaStableAbi,
} as const;
