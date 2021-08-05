import { action, observable } from "mobx";
import { Actor, ExpressionOptions, Stat } from "./internal";

export class Attribute extends Stat {
  constructor(name: string, actor: Actor, baseValue: number = 1) {
    super(name, actor, Attribute.defaultOptions);
    this.setBaseValue(baseValue);
  }

  @observable baseValue = 0;

  @action increaseBaseValue = () => this.baseValue++;
  @action decreaseBaseValue = () => this.baseValue++;
  @action setBaseValue = (value) => (this.baseValue = value);

  static get defaultOptions(): ExpressionOptions<Attribute> {
    return {
      preExpressions: [(_, attribute: Attribute) => attribute.baseValue],
      expressions: [],
      postExpressions: [
        // Floor
        (value: number, _) => Math.floor(value),
        // Clamp to 1
        (value: number, _) => Math.max(value, 1)
      ]
    };
  }
}
