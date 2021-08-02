import { Actor, Derivative } from "../internal";

export class WeaponEncumbrance extends Derivative {
  constructor(actor: Actor) {
    super("weaponEncumbrance", actor, {
      expressions: [
        (_, derivative) =>
          derivative.actor.items
            .filter(Actor.isItemWeaponType)
            .reduce(Actor.encumbranceFromItems, 0)
      ]
    });
  }
}
