import { action } from "mobx";

import { Actor, Stat, ExpressionOptions } from "./internal";

export class Attribute extends Stat {
  constructor(
    name: string,
    actor: Actor,
    baseValue: number = 1,
    expressionOptions: ExpressionOptions<Attribute> = {}
  ) {
    super(name, actor, {
      preExpressions: (expressionOptions.preExpressions || []).concat(
        Attribute.defaultOptions.preExpressions
      ),
      expressions: (expressionOptions.expressions || []).concat(
        Attribute.defaultOptions.expressions
      ),
      postExpressions: (expressionOptions.postExpressions || []).concat(
        Attribute.defaultOptions.postExpressions
      )
    });
    this.setBaseValue(baseValue);
  }

  @action increaseBaseValue = () => this.baseValue++;

  @action setBaseValue = (value) => (this.baseValue = value);

  static get defaultOptions(): ExpressionOptions<Attribute> {
    return {
      preExpressions: [],
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
