import { Actor, Derivative, ItemAttack } from "../internal";

export class RangedAttackPower extends Derivative {
  constructor(actor: Actor) {
    super("rangedAttackPower", actor, {
      expressions: [
        (_, derivative: Derivative) =>
          derivative.actor.rangedAttackSets.reduce(
            (value: number, attack: ItemAttack) => {
              const booster = derivative.actor.attributes.perception.value * 3;
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
