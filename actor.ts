import { observable, action, computed } from "mobx";

import { Attribute, Derivative } from "./internal";

export class Actor {
  // Simplified version of the inventory
  @observable items = [
    {
      sideEffects: {
        passives: [
          {
            property: "strength",
            value: 2,
            type: "factor"
          }
        ]
      }
    },
    {
      sideEffects: {
        passives: [
          {
            property: "strength",
            value: 5,
            type: "term"
          }
        ]
      }
    }
  ];

  @computed get passives() {
    return this.items.reduce((passives, item) => {
      if (item.sideEffects.passives && item.sideEffects.passives.length > 0) {
        passives.push(...item.sideEffects.passives);
      }

      return passives;
    }, []);
  }

  @action equipItem = (item) => {
    this.items.push(item);
  };

  attributes = {
    strength: new Attribute("strength", this, 4),
    charisma: new Attribute("charisma", this),
    resilience: new Attribute("resilience", this),
    agility: new Attribute("agility", this),
    perception: new Attribute("perception", this)
  };

  derivatives = {
    protection: new Derivative("protection", this, [
      (_, derivative) => derivative.actor.attributes.resilience.value
    ]),
    chanceToDodge: new Derivative("chanceToDodge", this, [
      (_, derivative) => derivative.actor.attributes.agility.value,
      (value, _) => value / 100,
      (value, _) => Math.min(value, 0.5)
    ]),
    chanceToBlock: new Derivative("chanceToBlock", this, [
      (_, derivative) => derivative.actor.attributes.resilience.value,
      (value, _) => value / 10,
      (value, _) => Math.min(value, 0.8)
    ])
  };
}
