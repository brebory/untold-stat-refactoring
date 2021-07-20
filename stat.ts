import { computed, observable, trace } from "mobx";
import { Actor, StatModifier } from "./internal";

export abstract class Stat {
  constructor(
    public readonly name: string, // keyof Stats (?)
    public actor: Actor,
    expressionOptions: ExpressionOptions = {}
  ) {
    this.expressions = (expressionOptions.preExpressions || [])
      .concat(Stat.preExpressions)
      .concat(expressionOptions.expressions || [])
      .concat(Stat.postExpressions)
      .concat(expressionOptions.postExpressions || []);
  }

  public readonly expressions: StatExpression[];

  @observable baseValue = 0;

  @computed get value() {
    trace();

    const value = this.expressions.reduce(
      (value, expression) => expression(value, this),
      this.baseValue
    );

    return value;
  }

  @computed get filteredStatModifiers(): StatModifier[] {
    return this.actor.statModifiers.filter(
      (statModifier) => statModifier.statName === this.name
    );
  }

  static get preExpressions(): StatExpression<Stat>[] {
    return [];
  }

  static get postExpressions(): StatExpression<Stat>[] {
    return [
      // Term passives
      (value: number, stat: Stat) =>
        stat.filteredStatModifiers
          .filter((statModifier) => statModifier.type === "term")
          .reduce(
            (accumulation, statModifier) => accumulation + statModifier.value,
            value
          ),

      // Factor passives
      (value: number, stat: Stat) =>
        stat.filteredStatModifiers
          .filter((statModifier) => statModifier.type === "factor")
          .reduce(
            (accumulation, statModifier) => accumulation * statModifier.value,
            value
          )
    ];
  }
}

export type StatExpression<StatContext extends Stat = any> = (
  value: number,
  context: StatContext
) => number;

export type ExpressionOptions<StatContext extends Stat = any> = {
  preExpressions?: StatExpression<StatContext>[];
  expressions?: StatExpression<StatContext>[];
  postExpressions?: StatExpression<StatContext>[];
};
