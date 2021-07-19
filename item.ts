export interface Item {
  type: string;
  sideEffects?: {
    passives: Passive[];
  };
  encumbrance?: number;
  armor?: number;
}

export interface Passive {
  type: string;
  property: string;
  value: number;
}
