"use strict";

const { sanitizeEntity } = require("strapi-utils");

const isValidRequest = (strapi, controller, action) => {
  console.log("VALID CHECK");
  const { actions } = strapi.plugins.socket.services.socket;
  return controller in strapi.controllers && actions().includes(action);
};

const emit = (controller, action, data) => {
  console.log("SOCKET:");
  console.log(action);
  console.log(data);
  strapi.StrapIO.emit(controller, action, data);
};

const handlePlugin = (strapi, ctx) => {
  if (
    isValidRequest(
      strapi,
      ctx.request.route.controller,
      ctx.request.route.action
    )
  ) {
    emit(
      strapi.controllers[ctx.request.route.route.controller],
      route.action,
      ctx.response.body
    );
  }
};

const handleCollectionTypes = async (strapi, ctx) => {
  let model = strapi.getModel(ctx.params.model);
  let action;
  let data;

  if (ctx.request.route.action === "bulkdelete") {
    action = "delete";
    const rawData = Object.values(ctx.response.body);
    data = rawData.map((entity) =>
      sanitizeEntity(entity, {
        model: strapi.models[model.apiName],
      })
    );
  } else {
    action = ctx.request.route.action;
    data = sanitizeEntity(ctx.response.body, {
      model: strapi.models[model.apiName],
    });
  }

  if (isValidRequest(strapi, model.apiname, ctx.request.route.action)) {
    emit(strapi.controllers[model.apiName], action, data);
  }
};

module.exports = (strapi) => {
  return {
    beforeInitialize() {
      strapi.config.middleware.load.after.unshift("socket");
    },
    initialize() {
      strapi.app.use(async (ctx, next) => {
        console.log("lol");
        await next();
        try {
          if (route.plugin) handlePlugin(strapi, ctx);
          if (route.controller === "collection-types")
            handleCollectionTypes(strapi, ctx);
        } catch (err) {
          console.log(err);
        }
      });
    },
  };
};
