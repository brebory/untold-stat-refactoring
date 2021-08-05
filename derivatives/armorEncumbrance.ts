import { Actor, Derivative } from '../internal';

export class ArmorEncumbrance extends Derivative {
  constructor(actor: Actor) {
    super("armorEncumbrance", actor, {
      expressions: [
        (_, derivative) =>
          derivative.actor.items
            .filter(Actor.isItemArmorType)
            .reduce(Actor.encumbranceFromItems, 0)
      ]
    });
  }
}