import { Stat, ExpressionOptions } from "./internal";

export class Derivative extends Stat {
  constructor(
    name: string,
    actor,
    expressions: ExpressionOptions<Derivative> = {}
  ) {
    super(name, actor, expressions);
  }
}
