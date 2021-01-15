import AdminBro, { Router as AdminRouter } from "admin-bro";
import { FastifyInstance, RouteHandlerMethod } from "fastify";
import path from "path";

import { WrongArgumentError } from "./errors";

export const attachRoutes = (
  adminBroInstance: AdminBro,
  fastifyApp: FastifyInstance
): void => {
  if (adminBroInstance?.constructor?.name !== "AdminBro") {
    throw new WrongArgumentError();
  }

  adminBroInstance.initialize().then(() => {
    console.info("AdminBro: bundle ready");
  });

  const { routes, assets } = AdminRouter;

  routes.forEach((route) => {
    // to support fastify routes
    // we have to change routes defined in AdminBro from {recordId} to :recordId
    const fastifyPath = route.path.replace(/{/g, ":").replace(/}/g, "");

    const handler: RouteHandlerMethod = async (request, reply) => {
      const controller = new route.Controller({ admin: adminBroInstance });
      const { params, query } = request;
      const method = request.method.toLowerCase();
      //   TODO: do we need this?
      //   const payload = {
      //     ...(request.fields || {}),
      //     ...(request.files || {}),
      //   };
      const html = await controller[route.action](
        {
          ...request,
          params,
          query,
          payload: {},
          method,
        },
        reply
      );
      if (route.contentType) {
        reply.header("Content-Type", route.contentType);
      }
      if (html) {
        reply.send(html);
      }
    };

    if (route.method === "GET") {
      console.info(fastifyPath);
      fastifyApp.get(fastifyPath, handler);
    }

    if (route.method === "POST") {
      console.info(fastifyPath);
      fastifyApp.post(fastifyPath, handler);
    }
  });

  assets.forEach((asset) => {
    console.info(asset.path);
    fastifyApp.get(asset.path, async (req, res) => {
      res.send(path.resolve(asset.src));
    });
  });
};
