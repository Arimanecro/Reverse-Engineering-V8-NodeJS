import repl from "node:repl";
import "./v8-func-wrapper.js";

/**
 * Advantages:
 * - [FastProperties]
 * - properties: <FixedArray[0]>
 * Disadvantages:
 * - instance size: 56
 * - transitions: <TransitionArray[150]>
 */
const curlyBrace = {};

/**
 * Advantages:
 * - [FastProperties]
 * - properties: <FixedArray[0]>
 * - instance size: 32
 * Disadvantages: 0
 */
const objectWithKey = { test: "test" };

/**
 * Advantages:
 * - [FastProperties]
 * - properties: <FixedArray[0]>
 * Disadvantages:
 * - instance size: 56
 */
const objectCreate = Object.create({});

/**
 * Advantages:
 * - instance size: 24
 * Disadvantages:
 * - [DictionaryProperties]
 * - properties: <NameDictionary[17]>
 */
const objectWithoutProto = Object.create(null);

/**
 * Advantages:
 * - [FastProperties]
 * - properties: <FixedArray[0]>
 * Disadvantages:
 * - instance size: 56
 * - transitions: <TransitionArray[150]>
 */
const object = new Object();
const jsonParse = JSON.parse("{}"); // same as const object

// DYNAMICALLY CREATING PROPERTIES

/**
 * ! STRING AS OBJECT KEY
 * Changed from [FastProperties] to [DictionaryProperties]
 * Changed instance size from 56 to 24
 */
for (let index = 0; index < 100; index++) curlyBrace[`abc${index}`] = index;

/**
 * ! NUMBER AS OBJECT KEY
 * [FastProperties] remain
 * added: 100-139 hole extra elements !!!
 * added: <TransitionArray[150]>
 */
for (let index = 0; index < 100; index++) curlyBrace[index] = index;

/**
 * ! STRING AS OBJECT KEY
 * [FastProperties] remain
 * instance size 56 remain
 * changed from <FixedArray[140]> to <PropertyArray[96]>
 * why 96? First four elements have location: in-object, anothers 96 in PropertyArray
 */
for (let index = 0; index < 100; index++) {
  Object.defineProperty(curlyBrace, `abc${index}`, {
    value: index,
  });
}

/**
 * ! NUMBER AS OBJECT KEY
 * [FastProperties] remain
 * elements: <NumberDictionary[772]> [DICTIONARY_ELEMENTS]
 * Dictionary but FastProperties!
 */
for (let index = 0; index < 100; index++) {
  Object.defineProperty(curlyBrace, index, {
    value: index,
  });
}

// UPDATE:

console.log(process.versions.v8); // 11.8.172.17

{
  var obj = { name: "Jane Doe", age: 39 };

  // ✅ inobject properties: 1
  // ✅ unused property fields: 0
  // ✅ instance size: 40
}

{
  var obj = {}; // or new Object / Object.create({});

  //  ❗inobject properties: 4
  //  ❗unused property fields: 4
  //  ❗instance size: 56
}

{
  var obj = { name: "Jane Doe" };
  obj.age = 39;

  // ✅ #name --> location: in-object
  // ❗ #age --> location: properties[0]
  // ❗ unused property fields: 2
  // ✅ inobject properties: 1
  // ✅ instance size: 32
}

{
  var obj = { name: "", age: 0 };
  obj.name = "Jane Doe";
  obj.age = 39;

  // ✅ #name --> location: in-object
  // ✅ #age --> location: in-object
  // ✅ unused property fields: 0
  // ✅ inobject properties: 2
  // ✅ instance size: 40
}

{
  var obj = {};

  for (let index = 0; index < 10; index++) {
    Object.defineProperty(curlyBrace, `abc${index}`, {
      value: `abc${index}`,
    });      
    }

  // ❗After the fourth index, elements begin to be stored in a structure --> [properties]
  // ❗instance size: 56
  // ❗unused property fields: 2
  // ❗inobject properties: 4
}


// v8.dp(curlyBrace);

/**
 * RECAP:
 * - The best way to create object is: Object.create({})
   - The situation with objects is exactly the same as with arrays:
Each time empty slots are allocated, the memory address where the main (non-empty) elements of the object are located changes (read more in recap of array.js)
After inserting the fourth element into the object, the remaining elements begin to be stored in a structure called - location: properties which is slower than - location: in-object.
That's why object fields must be declared in advance 👍
*/
