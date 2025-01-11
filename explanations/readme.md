# Explanation

Each unit has stats, and these stats, as we know, affect the unit's skills. However, they also influence the jobs the unit can take on, which in turn provide bonuses to certain skills.

For each attribute, every 2 points above 10 grant a +1 bonus to the skills that require it (rounded down), while every 2 points below 10 apply a -1 penalty (rounded up).

Let’s consider a unit with the following stats:

**Strength** (St): 10  
**Agility** (Ag): 7  
**Constitution** (Co): 13  
**Intelligence** (In): 10  
**Wisdom** (Wi): 19  
**Charisma** (Ch): 7

If we take *Gardening* as an example, which requires **Wi/En/In**, this unit will have a bonus of +5.  
If we take *Carpentry* as an example, which requires **Ag/St/En**, this unit will have a bonus of 0.  
If we take *Enamelling* as an example, which requires **Ag**, this unit will have a penalty of -1.  

The formula to calculate the bonus is as follows:

```
((attr - 10) / 2)
```

where *attr* is the attribute required for the job. If a job requires multiple attributes, the individual bonuses are summed up.

Using the previous examples:

*Gardening*: [((19 - 10) / 2) = 4] + [((13 - 10) / 2) = 1] + [((10 - 10) / 2) = 0] = 5  
*Carpentry*: [((7 - 10) / 2) = -1] + [((10 - 10) / 2) = 0] + [((13 - 10) / 2) = 1] = 0  
*Enamelling*: ((7 - 10) / 2) = -1  

It’s important to consider that, in the game, these calculations take into account additional bonuses and penalties, which may be provided by:

- Day
- Location
- Equipment
- Relics
- Other factors

These can be viewed in the Encyclopedia. Bonuses are applied at 50% quality (halved at 0% and doubled at 100% quality)

E.g. hoe +5 to Gardening at 50% quality, +2 at 0% and +10 at 100%.

Finally, bonuses and penalties from professions must also be added.

For example:
A Gardener gets +5 to Gardening.

So, considering our unit:

- Gardener (+5 to Gardening)
- On January 11, 2025 (+1 Wi, +2 Co) — this increase raises the bonus from stats to +7
- In a garden at 50% quality (+10 to Gardening)
- Equipped with a hoe at 50% quality (+5 to Gardening)
- Without considering other factors

The unit will have a total of 5 + 7 + 10 + 5 = +27 to Gardening.

## Notes

Profession bonuses are only positive if the unit belongs to that profession. Otherwise, there is a -20 penalty.
For example, a Gardener, who has bonuses in Gardening, Fruit Harvesting, Planting, Plowing, and Land Surveying, will have a base penalty of -20 to all other abilities.
