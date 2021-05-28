"use strict";

module.exports = () => {
  process.nextTick(() => {
    console.log("loading up");
    strapi.StrapIO = new (require("strapio"))(strapi);
  });
};
