import { Stat, StatExpression } from "./internal";

export class Derivative extends Stat {
  constructor(
    name: string,
    actor,
    expressions: StatExpression<Derivative>[] = []
  ) {
    super(name, actor, expressions);
  }
}
