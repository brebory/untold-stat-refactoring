import { action } from "mobx";

import { Actor, Stat, StatExpression } from "./internal";

export class Attribute extends Stat {
  constructor(
    name: string,
    actor: Actor,
    baseValue: number = 1,
    expressions: StatExpression<Attribute>[] = []
  ) {
    super(name, actor, expressions.concat(Attribute.defaultExpressions));
    this.setBaseValue(baseValue);
  }

  @action increaseBaseValue = () => this.baseValue++;

  @action setBaseValue = (value) => (this.baseValue = value);

  static get defaultExpressions(): StatExpression<Attribute>[] {
    return [
      // Floor
      (value: number, _) => Math.floor(value),
      // Clamp to 1
      (value: number, _) => Math.max(value, 1)
    ];
  }
}
