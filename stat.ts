import { action, computed, observable, trace } from "mobx";
import { Actor, Passive } from "./internal";

export abstract class Stat {
  constructor(
    public readonly name: string, // keyof Stats (?)
    actor: Actor,
    public readonly expressions: StatExpression[]
  ) {
    this.setActor(actor);
    this.expressions = Stat.defaultExpressions.concat(this.expressions);
  }

  @observable baseValue = 0;
  @observable actor: Actor = undefined;

  @action setActor(actor: Actor) {
    this.actor = actor;
  }

  @computed get value() {
    trace();

    const expressions = this.expressions.reduce(
      (value, expression) => expression(value, this),
      this.baseValue
    );

    return expressions;
  }

  @computed get filteredPassives(): Passive[] {
    return this.actor.passives.filter(
      (passive) => passive.property === this.name
    );
  }

  static get defaultExpressions(): StatExpression<Stat>[] {
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
