import { Actor, Derivative } from "../internal";

export class ChanceToDodge extends Derivative {
  constructor(actor: Actor) {
    super("chanceToDodge", actor, {
      expressions: [
        (_, derivative) => derivative.actor.attributes.agility.value,
        (value, _) => value / 100
      ],
      postExpressions: [(value, _) => Math.min(value, 0.5)]
    });
  }
}
