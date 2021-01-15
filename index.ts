import "reflect-metadata";
import express from "express";
import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import * as AdminBroFirebase from "@tirrilee/admin-bro-firebase";
import firebase from "firebase";
import { firebaseConfig } from "./firebase.creds";

firebase.initializeApp(firebaseConfig);

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

  const app = express();
  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
  app.listen(3000);
  console.log("Admin Bro running on port 3000!");
})();
