import localforage from "localforage";

localforage.config({
  name: "stellaron-app",
  description: "stellaron-app local storage",
});

export default localforage;
