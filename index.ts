import "reflect-metadata";

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  createConnection,
} from "typeorm";
import express from "express";
import { Database, Resource } from "@admin-bro/typeorm";
import { validate } from "class-validator";

import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

@Entity()
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;
}

(async () => {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "alecbrunelle",
    password: "",
    database: "postgres",
    logging: true,
    synchronize: true,
    entities: [Person],
  });

  const adminBro = new AdminBro({
    databases: [connection],
    resources: [{ resource: Person }],
    rootPath: "/admin",
  });

  const app = express();
  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
  app.listen(3000);
})();
