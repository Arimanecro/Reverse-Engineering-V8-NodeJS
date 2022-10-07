import vm from "vm";
import spy from "./spy.js";
process.env.SECRET_KEY = "12345678";

// We block access to this.constructor by using Object.create(null)

try {
  const script = new vm.Script(spy);
  script.runInNewContext(
    Object.create(null, {
      ["console"]: { value: console },
      ["process"]: {
        value: {
          exit: () => console.log("access to process.exit()"),
          get env() {
            console.log("access to process.env");
          },
        },
      },
    }),
    { displayErrors: true }
  );
} catch (e) {
  console.error(e);
}
