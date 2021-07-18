import { autorun } from "mobx";

import { Actor } from "./internal";

const person = new Actor();

// Use autorun to force observation of the observable values
for (let attribute of Object.values(person.attributes)) {
  autorun(() => {
    console.log("###########################################");
    console.log(
      `Attribute: ${attribute.name}`,
      `Value: ${attribute.value}`,
      `Base Value: ${attribute.baseValue}`
    );
  });
}

for (let derivative of Object.values(person.derivatives)) {
  autorun(() => {
    console.log("###########################################");
    console.log(`Derivative: ${derivative.name}`, `Value: ${derivative.value}`);
  });
}

// Alter values and see if everything is updated as expected
person.attributes.strength.increaseBaseValue();
person.attributes.resilience.increaseBaseValue();
person.attributes.agility.increaseBaseValue();

person.equipItem({
  sideEffects: {
    passives: [{ property: "resilience", value: 1, type: "term" }]
  }
});
