import { observable, action, computed } from "mobx";

import { Attribute, Derivative, Item, StatModifier } from "./internal";

export class Actor {
  @observable items: Item[] = [];

  @computed get statModifiers(): StatModifier[] {
    return this.items.reduce((statModifiers, item) => {
      if (
        item.sideEffects &&
        item.sideEffects.statModifiers &&
        item.sideEffects.statModifiers.length > 0
      ) {
        statModifiers.push(...item.sideEffects.statModifiers);
      }

      return statModifiers;
    }, [] as StatModifier[]);
  }

  @action equipItem = (item: Item) => {
    this.items.push(item);
  };

  attributes = {
    strength: new Attribute("strength", this),
    charisma: new Attribute("charisma", this),
    resilience: new Attribute("resilience", this),
    agility: new Attribute("agility", this),
    perception: new Attribute("perception", this)
  };

  derivatives: { [key: string]: Derivative } = {
    protection: new Derivative("protection", this, {
      expressions: [
        (_, derivative) => derivative.actor.attributes.resilience.value
      ]
    }),
    chanceToDodge: new Derivative("chanceToDodge", this, {
      expressions: [
        (_, derivative) => derivative.actor.attributes.agility.value,
        (value, _) => value / 100
      ],
      postExpressions: [(value, _) => Math.min(value, 0.5)]
    }),
    chanceToBlock: new Derivative("chanceToBlock", this, {
      expressions: [
        (_, derivative) => derivative.actor.attributes.resilience.value,
        (value, _) => value / 10
      ],
      postExpressions: [(value, _) => Math.min(value, 0.8)]
    }),
    armorEncumbrance: new Derivative("armorEncumbrance", this, {
      expressions: [
        (_, derivative) =>
          derivative.actor.items
            .filter(Actor.isItemArmorType)
            .reduce(Actor.encumbranceFromItems, 0)
      ]
    }),
    weaponEncumbrance: new Derivative("weaponEncumbrance", this, {
      expressions: [
        (_, derivative) =>
          derivative.actor.items
            .filter(Actor.isItemWeaponType)
            .reduce(Actor.encumbranceFromItems, 0)
      ]
    }),
    weaponEfficiency: new Derivative("weaponEfficiency", this, {
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
    }),
    attackSpeed: new Derivative("attackSpeed", this, {
      expressions: [
        (_, derivative) => 1.1 + derivative.actor.attributes.agility.value / 6,
        (value, derivative) =>
          value * derivative.actor.derivatives.weaponEfficiency.value
      ],
      postExpressions: [(value, _) => Math.max(value, 0)]
    })
  };

  static armorItemTypes = ["armor", "shield"];
  static weaponItemTypes = ["weapon"];
  static isItemArmorType = (item) => Actor.armorItemTypes.includes(item.type);
  static isItemWeaponType = (item) => Actor.weaponItemTypes.includes(item.type);
  static encumbranceFromItems = (total, item) =>
    total + (item.encumbrance || 0);
}
