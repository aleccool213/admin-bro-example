import "reflect-metadata";
import AdminBro from "admin-bro";
import * as AdminBroFirebase from "@tirrilee/admin-bro-firebase";
import firebase from "firebase-admin";
import fastify from "fastify";

import { attachRoutes } from "./fastifyAdapter";

firebase.initializeApp({
  credential: firebase.credential.cert("./firestore-creds.json"),
});

AdminBro.registerAdapter(AdminBroFirebase.FirestoreAdapter);

(async () => {
  const adminBro = new AdminBro({
    branding: {
      companyName: "Unity Live Platform Template Admin Panel",
    },
    resources: [
      {
        collection: firebase.firestore().collection("Templates"),
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

  const app = fastify({ logger: true });
  attachRoutes(adminBro, app);
  await app.listen(3000);
  console.log("Admin Bro running on port 3000!");
})();
