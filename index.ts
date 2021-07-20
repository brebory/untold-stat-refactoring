import { autorun } from "mobx";

import { Actor } from "./internal";

const person = new Actor();
const disposers = [];

// Use autorun to force observation of the observable values
for (let attribute of Object.values(person.attributes)) {
  const disposer = autorun(() => {
    console.log("###########################################");
    console.log(
      `Attribute: ${attribute.name}`,
      `Value: ${attribute.value}`,
      `Base Value: ${attribute.baseValue}`
    );
  });
  disposers.push(disposer);
}

for (let derivative of Object.values(person.derivatives)) {
  const disposer = autorun(() => {
    console.log("###########################################");
    console.log(`Derivative: ${derivative.name}`, `Value: ${derivative.value}`);
  });
  disposers.push(disposer);
}

// Alter values and see if everything is updated as expected
console.log("###########################################");
console.log("Increasing Strength +1, Resilience +1, and Agility +1");

person.attributes.strength.increaseBaseValue();
person.attributes.resilience.increaseBaseValue();
person.attributes.agility.increaseBaseValue();

console.log("###########################################");
console.log("Equipping Heavy Weapon (WENC +10)");

person.equipItem({
  type: "weapon",
  encumbrance: 10
});

console.log("###########################################");
console.log("Equipping Strength Doubling Ring (STR x2)");

person.equipItem({
  type: "accessory",
  sideEffects: {
    statModifiers: [
      {
        statName: "strength",
        value: 2,
        type: "factor"
      }
    ]
  }
});

console.log("###########################################");
console.log("Equipping Giant's Belt (STR +3)");

person.equipItem({
  type: "accessory",
  sideEffects: {
    statModifiers: [
      {
        statName: "strength",
        value: 3,
        type: "term"
      }
    ]
  }
});

console.log("###########################################");
console.log("Equipping Heavy Armor (AENC +10)");

person.equipItem({
  type: "armor",
  encumbrance: 10,
  armor: 10
});

console.log("###########################################");
console.log("Equipping Resilience Ring (RES +1)");

person.equipItem({
  type: "accessory",
  sideEffects: {
    statModifiers: [{ statName: "resilience", value: 1, type: "term" }]
  }
});

console.log("###########################################");
console.log("Equipping Cursed Encumbrance Ring (ENC x2)");

person.equipItem({
  type: "accessory",
  sideEffects: {
    statModifiers: [
      { statName: "armorEncumbrance", value: 2.0, type: "factor" },
      { statName: "weaponEncumbrance", value: 2.0, type: "factor" }
    ]
  }
});

console.log("###########################################");
console.log("Equipping Havel's Ring (WEF x3)");

// There was a bug with the ordering of expressions.
// Previously, weaponEfficiency was able to exceed 1
// Fixed by adding the ability to pass pre/post expressions
// to the base Stat class
// Order:
// child pre expressions -> Stat pre expressions => child expressions => Stat post expressions => child post expressions

person.equipItem({
  type: "accessory",
  sideEffects: {
    statModifiers: [
      { statName: "weaponEfficiency", value: 3.0, type: "factor" }
    ]
  }
});

for (let disposerFn of disposers) {
  disposerFn();
}
