import { Actor, Derivative, ItemAttack } from "../internal";

export class MeleeAttackPower extends Derivative {
  constructor(actor: Actor) {
    super("meleeAttackPower", actor, {
      expressions: [
        (_, derivative: Derivative) =>
          derivative.actor.meleeAttackSets.reduce(
            (value: number, attack: ItemAttack) => {
              const booster = derivative.actor.attributes.strength.value / 8;
              const min = attack.damage.min + booster;
              const max = attack.damage.max + booster;

              return Math.max(value + (min + max) / 2, 0);
            },
            0
          ) * derivative.actor.derivatives.attackSpeed.value
      ]
    });
  }
}
