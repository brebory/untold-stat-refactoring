import { StatModifier } from "./internal";

export interface Item {
  type: string;
  sideEffects?: {
    statModifiers: StatModifier[];
  };
  encumbrance?: number;
  armor?: number;
  attackSet?: ItemAttackSet;
}

export interface ItemAttack {
  damage: Damage;
  ranged: boolean;
}

export type ItemAttackSet = ItemAttack[];

export interface Damage {
  min: number;
  max: number;
}
