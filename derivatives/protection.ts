import { Actor, Derivative, Item } from "../internal";

export class Protection extends Derivative {
  constructor(actor: Actor) {
    super("protection", actor, {
      expressions: [
        (_, derivative) => {
          return derivative.actor.items.reduce((total: number, item: Item) => {
            return total + (item.armor || 0);
          }, 0);
        },
        (value, derivative) =>
          value + derivative.actor.attributes.resilience.value * 2
      ]
    });
  }
}
