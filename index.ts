import "reflect-metadata";
import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import * as AdminBroFirebase from "@tirrilee/admin-bro-firebase";
import Firebase from "firebase-admin";
import Fastify from "fastify";
import FastifyExpress from "fastify-express";

Firebase.initializeApp({
  credential: Firebase.credential.cert("./firestore-creds.json"),
});

AdminBro.registerAdapter(AdminBroFirebase.FirestoreAdapter);

(async () => {
  const adminBro = new AdminBro({
    branding: {
      companyName: "Unity Live Platform Template Admin Panel",
    },
    resources: [
      {
        collection: Firebase.firestore().collection("Templates"),
        schema: {
          id: "string",
          name: "string",
          description: "string",
          packageName: "string",
        },
      },
    ],
    rootPath: "/admin",
  });

  const app = Fastify({ logger: true });
  await app.register(FastifyExpress);
  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);

  await app.listen(3000);
  console.log("AdminBro is under localhost:3000/admin");
})();
