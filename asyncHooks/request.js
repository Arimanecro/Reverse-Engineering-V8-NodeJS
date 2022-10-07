import { asyncLocalStorage } from "./async-storage.js";

export const request = () => {
  let { url } = asyncLocalStorage.getStore();
  console.log(url);
};
