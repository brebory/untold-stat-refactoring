import { StatModifier, ItemAttackSet } from "./internal";

export interface Item {
  type: string;
  sideEffects?: {
    statModifiers: StatModifier[];
  };
  encumbrance?: number;
  armor?: number;
  attackSet?: ItemAttackSet;
}
