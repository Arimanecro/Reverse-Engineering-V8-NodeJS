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

v8.dp(curlyBrace);

repl.start();

/**
 * RECAP:
 * - The best way to create object is: Object.create({})
 * - The best way to dynamically fill object is to use key as string:
 *   Object.defineProperty(arr, `abc${index}`, { value: index });
 */
