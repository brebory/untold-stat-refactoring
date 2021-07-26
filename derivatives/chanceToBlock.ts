import { Actor, Derivative } from '../internal';

export class ChanceToBlock extends Derivative {
  constructor(actor: Actor) {
    super("chanceToBlock", actor, {
      expressions: [
        (_, derivative) => derivative.actor.attributes.resilience.value,
        (value, _) => value / 10
      ],
      postExpressions: [(value, _) => Math.min(value, 0.8)]
    });
  }
}
