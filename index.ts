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
console.log("Increasing Strength, Resilience, and Agility");

person.attributes.strength.increaseBaseValue();
person.attributes.resilience.increaseBaseValue();
person.attributes.agility.increaseBaseValue();

console.log("###########################################");
console.log("Equipping Heavy Weapon");

person.equipItem({
  type: "weapon",
  encumbrance: 10
});

console.log("###########################################");
console.log("Equipping Strength Doubling ring");

person.equipItem({
  type: "accessory",
  sideEffects: {
    passives: [
      {
        property: "strength",
        value: 2,
        type: "factor"
      }
    ]
  }
});

console.log("###########################################");
console.log("Equipping Giant's Belt");

person.equipItem({
  type: "accessory",
  sideEffects: {
    passives: [
      {
        property: "strength",
        value: 3,
        type: "term"
      }
    ]
  }
});

console.log("###########################################");
console.log("Equipping Heavy Armor");

person.equipItem({
  type: "armor",
  encumbrance: 10,
  armor: 10
});

console.log("###########################################");
console.log("Equipping Resilience ring");

person.equipItem({
  type: "accessory",
  sideEffects: {
    passives: [{ property: "resilience", value: 1, type: "term" }]
  }
});

console.log("###########################################");
console.log("Equipping cursed Encumbrance ring");

person.equipItem({
  type: "accessory",
  sideEffects: {
    passives: [{ property: "armorEncumbrance", value: 2.0, type: "factor" }]
  }
});

for (let disposerFn of disposers) {
  disposerFn();
}
