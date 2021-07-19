import { computed, observable, trace } from "mobx";
import { Actor, Passive } from "./internal";

export abstract class Stat {
  constructor(
    public readonly name: string, // keyof Stats (?)
    public actor: Actor,
    public readonly expressions: StatExpression[]
  ) {
    this.expressions = Stat.preExpressions
      .concat(this.expressions)
      .concat(Stat.postExpressions);
  }

  @observable baseValue = 0;

  @computed get value() {
    trace();

    const value = this.expressions.reduce(
      (value, expression) => expression(value, this),
      this.baseValue
    );

    return value;
  }

  @computed get filteredPassives(): Passive[] {
    return this.actor.passives.filter(
      (passive) => passive.property === this.name
    );
  }

  static get preExpressions(): StatExpression<Stat>[] {
    return [];
  }

  static get postExpressions(): StatExpression<Stat>[] {
    return [
      // Term passives
      (value: number, stat: Stat) =>
        stat.filteredPassives
          .filter((passive) => passive.type === "term")
          .reduce((value, passive) => value + passive.value, value),

      // Factor passives
      (value: number, stat: Stat) =>
        stat.filteredPassives
          .filter((passive) => passive.type === "factor")
          .reduce((value, passive) => value * passive.value, value)
    ];
  }
}

export type StatExpression<StatContext extends Stat = any> = (
  value: number,
  context: StatContext
) => number;
