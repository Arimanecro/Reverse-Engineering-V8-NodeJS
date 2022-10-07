import "./v8-func-wrapper.js";

{
  let obj1 = { name: "moloch" };
  let obj2 = { name: "baal" };

  v8.hsm(obj1, obj2); // true
}

{
  let obj1 = { name: "moloch" };
  let obj2 = {};
  obj2["name"] = "baal";

  v8.hsm(obj1, obj2); // false
}

{
  let obj1 = {};
  let obj2 = {};
  obj1["name"] = "moloch";
  obj2["name"] = "baal";

  v8.hsm(obj1, obj2); // true
}

{
  let obj1 = {};
  let obj2 = {};
  obj1["name"] = "moloch";
  obj1["age"] = 38;
  obj2["age"] = 38;
  obj2["name"] = "baal";

  v8.hsm(obj1, obj2); // false
}

{
  let obj1 = { name: "moloch", age: 777 };
  let obj2 = { name: "baal", age: 666 };
  obj1["name"] = "asmodeus";
  obj1["age"] = 555;
  obj2["age"] = 888;
  obj2["name"] = "lilith";

  v8.hsm(obj1, obj2); // true
}

{
  let myClass = function (a, b) {
    this.a = a;
    this.b = b;
  };
  let obj1 = new myClass(1, 2);
  let obj2 = new myClass(3, 4);

  v8.hsm(obj1, obj2); // true
}

{
  let myClass = function (a, b) {
    this.a = a;
    this.b = b;
  };
  let obj1 = new myClass(1, 2);
  let obj2 = new myClass(3, 4);
  obj1.c = 3;
  v8.hsm(obj1, obj2); // false
}

{
  let myClass = function (a, b) {
    this.a = a;
    this.b = b;
  };
  let obj1 = new myClass(1, 2);
  let obj2 = new myClass(3, 4);
  obj1["0"] = 111;
  obj1[0] = 222;
  v8.hsm(obj1, obj2); // true
}

{
  let arr1 = [];
  let arr2 = [1, 2, 3];
  v8.hsm(arr1, arr2); // true
}

{
  let arr1 = [];
  let arr2 = [1, 2, 3];
  arr1.push(90);
  v8.hsm(arr1, arr2); // true
}

{
  let arr1 = [];
  let arr2 = [];
  arr1[0] = 111;
  arr2[0] = 222;
  v8.hsm(arr1, arr2); // true
}

{
  let arr1 = [];
  let arr2 = [];
  arr1[0] = 111;
  arr2[0] = "rrr";
  v8.hsm(arr1, arr2); // false
}
