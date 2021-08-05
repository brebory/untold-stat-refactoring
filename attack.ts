export interface ItemAttack {
  damage: Damage;
  ranged?: boolean;
}

export interface Damage {
  min: number;
  max: number;
}

export type ItemAttackSet = ItemAttack[];
