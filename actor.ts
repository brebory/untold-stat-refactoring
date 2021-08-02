import { observable, action, computed } from "mobx";

import {
  Attribute,
  ArmorEncumbrance,
  AttackSpeed,
  ChanceToDodge,
  ChanceToBlock,
  Derivative,
  Item,
  ItemAttackSet,
  Protection,
  StatModifier,
  WeaponEfficiency,
  WeaponEncumbrance
} from "./internal";

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

  @computed get attackSets(): ItemAttackSet {
    return this.items
      .filter((item) => item.type === "weapon")
      .reduce(
        (attackSets: ItemAttackSet, item: Item) =>
          item.attackSet ? [...attackSets, ...item.attackSet] : attackSets,
        []
      );
  }

  @computed get meleeAttackSets(): ItemAttackSet {
    return this.attackSets.filter((attack) => !attack.ranged);
  }

  @computed get rangedAttackSets(): ItemAttackSet {
    return this.attackSets.filter((attack) => attack.ranged);
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
    protection: new Protection(this),
    chanceToDodge: new ChanceToDodge(this),
    chanceToBlock: new ChanceToBlock(this),
    armorEncumbrance: new ArmorEncumbrance(this),
    weaponEncumbrance: new WeaponEncumbrance(this),
    weaponEfficiency: new WeaponEfficiency(this),
    attackSpeed: new AttackSpeed(this)
  };

  static armorItemTypes = ["armor", "shield"];
  static weaponItemTypes = ["weapon"];
  static isItemArmorType = (item) => Actor.armorItemTypes.includes(item.type);
  static isItemWeaponType = (item) => Actor.weaponItemTypes.includes(item.type);
  static encumbranceFromItems = (total, item) =>
    total + (item.encumbrance || 0);
}
