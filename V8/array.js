import { PerformanceObserver, performance } from "perf_hooks";

console.log(process.versions.v8); // 11.8.172.17

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

var arr8 = Array(); // ! added: 0-3 hole extra elements !!!
var arr9 = []; // NO hole extra elements

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries();
  entry.forEach((e) =>
    console.log(`Time for ${e.name} : ${e.duration.toFixed(3)}`)
  );
  performance.clearMarks();
});
obs.observe({ type: "measure" });

{
  let arr = [1, 2, 3];
  arr.push(4);

  // ❗4-21: 0x02930a3c0411 <the_hole_value>
  // ✅ elements kind: PACKED_SMI_ELEMENTS

  performance.mark("PUSH - start");
  for (let index = 4; index < 10_000; index++) arr.push(index);
  performance.mark("PUSH - end");

  performance.measure("PUSH-TEST", "PUSH - start", "PUSH - end");
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The PUSH-TEST script uses approximately ${Math.round(used * 100) / 100} MB`
  );

  // ❗10000-10899: 0x0012f1580411 <the_hole_value>
  // ❗The memory address where the main (non-empty) array elements are located has changed
  // ❗The PUSH-TEST script uses approximately 4.45 MB
  // ✅ Time for PUSH-TEST : 0.777
}

{
  let arr = [1, 2, 3];

  // NUMBER AS ARRAY KEY
  for (let index = 3; index < 10_000; index++) arr[index] = index;
  // Same results as PUSH-TEST
  // ❗4.45 MB
  // ✅ Time: 0.742

  // STRING AS ARRAY KEY
  for (let index = 3; index < 10_000; index++) arr[`${index}`] = index;
  //❗Changed from [FastProperties] to [DictionaryProperties]
  //❗5.11 MB
  //❗Time: 9.532
}

{
  let arr = [1, 2, 3];

  Object.defineProperty(arr, `4`, {
    value: 4,
  });

  // ❗- requires_slow_elements:
  //  1: 2 (data, dict_index: 0, attrs: [WEC])
  //  0: 1 (data, dict_index: 0, attrs: [WEC])
  //  2: 3 (data, dict_index: 0, attrs: [WEC])
  //  4: 4 (data, dict_index: 0, attrs: [___])
  // ❗ elements kind: DICTIONARY_ELEMENTS

  performance.mark("defineProperty - start");
  for (let index = 4; index < 10_000; index++) {
    Object.defineProperty(arr, index, {
      value: index,
    });
  }
  performance.mark("defineProperty - end");

  performance.measure(
    "Object.defineProperty",
    "defineProperty - start",
    "defineProperty - end"
  );
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The Object.defineProperty script uses approximately ${
      Math.round(used * 100) / 100
    } MB`
  );

  // ❗The memory address where the main (non-empty) array elements are located has changed
  // ❗ Object.defineProperty-TEST script uses approximately 4.77 MB
  // ❗ Time for Object.defineProperty-TEST : 11.176
}

{
  let arr = Array(10_000);

  performance.mark("Fixed array - start");
  for (let index = 0; index < 10_000; index++) {
    arr[index] = index;
  }
  performance.mark("Fixed array - end");

  performance.measure(
    "Fixed array",
    "Fixed array - start",
    "Fixed array - end"
  );
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The Object.defineProperty script uses approximately ${
      Math.round(used * 100) / 100
    } MB`
  );

  // ✅ The memory address where the main (non-empty) elements of the array are located has NOT changed
  // ✅ Fixed array-TEST script uses approximately 4.26 MB
  // ✅ Time for Fixed array-TEST : 0.565
}

/**
 * Fastest way to copy arrays
 */
const copyArr = (arr1, arr2) => [...arr1, ...arr2];

/**
 * RECAP:
Each time empty slots are allocated, the memory address where the main (non-empty) elements of the array are located changes. 
This indicates that the V8 is allocating a new memory address and copying the array there, which is a very bad indicator for performance.
For example, when iterating 100 elements, the array is copied 4 times!!! (when the index is 4, 22, 50, 90)
That's why you need to give the array an initial length.
 */
