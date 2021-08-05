import { Actor, ExpressionOptions, Stat } from "./internal";

export class Derivative extends Stat {
  constructor(
    name: string,
    actor: Actor,
    expressions: ExpressionOptions<Derivative> = {}
  ) {
    super(name, actor, expressions);
  }
}
