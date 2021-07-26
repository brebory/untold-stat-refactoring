import { Actor, Derivative } from "../internal";

export class WeaponEfficiency extends Derivative {
  constructor(actor: Actor) {
    super("weaponEfficiency", actor, {
      expressions: [
        (_, derivative) => {
          const {
            weaponEncumbrance,
            armorEncumbrance
          } = derivative.actor.derivatives;
          const { strength } = derivative.actor.attributes;

          const weaponValue = weaponEncumbrance.value;
          const armorValue = armorEncumbrance.value;
          const strengthValue = strength.value;

          if (weaponValue > 0 || armorValue > 0) {
            return (2 + strengthValue) / (weaponValue + armorValue / 4);
          } else {
            return 1;
          }
        }
      ],
      postExpressions: [(value, _) => Math.min(value, 1)]
    });
  }
}
