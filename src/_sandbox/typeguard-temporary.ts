interface Cat {
  meow(): void;
}
interface Dog {
  bark(): void;
}
function isCat(pet: Dog | Cat): pet is Cat {
  return (pet as Cat).meow !== undefined;
}
const pet: Cat | Dog =
  Math.random() > 0.5
    ? { meow: () => console.log("Meow") }
    : { bark: () => console.log("Bark") };

// Using the 'is' keyword
if (isCat(pet)) {
  pet.meow();
} else {
  pet.bark();
}
