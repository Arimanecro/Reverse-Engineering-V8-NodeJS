import "./v8-func-wrapper.js";

/**
 * V8 internal types of arrays:
 * PACKED_SMI_ELEMENTS
   PACKED_DOUBLE_ELEMENTS
   PACKED_ELEMENTS
   HOLEY_SMI_ELEMENTS
   HOLEY_DOUBLE_ELEMENTS
   HOLEY_ELEMENTS
   BYTEARRAY
 */

var arr0 = []; // PACKED_SMI_ELEMENTS
var arr1 = [1, , 3]; // HOLEY_SMI_ELEMENTS
var arr2 = [1.2, , 1.4]; // HOLEY_DOUBLE_ELEMENTS
var arr3 = [1]; // PACKED_SMI_ELEMENTS
var arr4 = [1.5, 2.3]; // PACKED_DOUBLE_ELEMENTS
var arr5 = [1.0, 2.0]; // PACKED_SMI_ELEMENTS
var arr6 = ["test"]; // PACKED_ELEMENTS
var arr7 = [1, "test"]; // PACKED_ELEMENTS
// Uint8Array - BigUint64Array() BYTEARRAY

var arr8 = new Array(); // ! added: 0-3 hole extra elements !!!
var arr9 = []; // NO hole extra elements

var arr_10 = new Array(2);
arr_10[0] = 1;
arr_10[1] = 2;
// no hole extra elements
arr_10[2] = 3;
// added 3-19 hole extra elements

v8.dp(arr_10);

// DYNAMICALLY CREATING PROPERTIES

/**
 * ! STRING AS ARRAY KEY
 * Changed from [FastProperties] to [DictionaryProperties]
 */
for (let index = 0; index < 100; index++) arr0[`abc${index}`] = index;

/**
 * ! NUMBER AS ARRAY KEY
 * [FastProperties] remain
 * added: 100-139 hole extra elements !!!
 * added: <TransitionArray[4]>
 */
for (let index = 0; index < 100; index++) arr0[index] = index;

/**
 * ! STRING AS ARRAY KEY
 * [FastProperties] remain
 * <PropertyArray[102]>
 * NO hole extra elements like in an object !!!
 */
for (let index = 0; index < 100; index++) {
  Object.defineProperty(arr0, `abc${index}`, {
    value: index,
  });
}

/**
 * ! NUMBER AS ARRAY KEY
 * Same as an object
 */
for (let index = 0; index < 100; index++) {
  Object.defineProperty(arr0, index, {
    value: index,
  });
}

/**
 * ! METHOD PUSH
 * added: 100-139 hole extra elements !!!
 */
for (let index = 0; index < 100; index++) {
  arr0.push(index);
}

/**
 * RECAP:
 * - The best way to create array is: var arr = [];
 * - The best way to dynamically fill array is to use key as string:
 *   Object.defineProperty(arr0, `abc${index}`, { value: index });
 */
