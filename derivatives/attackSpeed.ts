import { Actor, Derivative } from '../internal';

export class AttackSpeed extends Derivative {
  constructor(actor: Actor) {
    super("attackSpeed", actor, {
      expressions: [
        (_, derivative) => 1.1 + derivative.actor.attributes.agility.value / 6,
        (value, derivative) =>
          value * derivative.actor.derivatives.weaponEfficiency.value
      ],
      postExpressions: [(value, _) => Math.max(value, 0)]
    });
  }
}