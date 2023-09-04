import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
//import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import compression from "express-compression";
import swaggerJsdoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";
import "express-async-errors";
import cron from "node-cron";
import fetch from "node-fetch";

import productsRouter from "../routes/products.routes.js";
import cartsRouter from "../routes/carts.routes.js";
import sessionsRouter from "../routes/sessions.routes.js";
import userRouter from "../routes/users.routes.js";
import roleRouter from "../routes/roles.routes.js";
import emailRouter from "../routes/email.routes.js";
import __dirname from "../../dirname.js";

import errorHandler from "../middlewares/errorHandler.js";
import { addLogger } from "../middlewares/logger.js";

class AppExpress {
  init() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: process.env.PRIVATE_KEY,
        resave: false,
        saveUninitialized: true,
      })
    );

    this.app.engine("handlebars", engine());
    this.app.set("view engine", "handlebars");
    this.app.set("views", __dirname + "/presentation/views");
    this.app.use(addLogger);

    this.app.use(
      compression({
        brotli: {
          enabled: true,
          zlib: {},
        },
      })
    );

    const swaggerOptions = {
      definition: {
        openapi: "3.0.1",
        info: {
          title: "Documentacion",
          description: "Documentacion en la api",
        },
      },
      apis: [`./docs/**/*.yaml`],
    };

    const specs = swaggerJsdoc(swaggerOptions);
    this.app.use(
      "/apidocs",
      SwaggerUiExpress.serve,
      SwaggerUiExpress.setup(specs)
    );

    cron.schedule("0 */48 * * *", async () => {
      fetch("http://localhost:8084/api/users/inactividad", {
        method: "DELETE",
      })
        .then(() => {
          req.loggerDesarrollo.info("Inactividad evaluada");
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    });
  }

  build() {
    this.app.use("/api/products", productsRouter);
    this.app.use("/api/carts", cartsRouter);
    this.app.use("/api/sessions", sessionsRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/roles", roleRouter);
    this.app.use("/api/email", emailRouter);
    this.app.use(errorHandler);
  }

  callback() {
    return this.app;
  }

  close() {
    this.server.close();
  }

  listen() {
    this.server = this.app.listen(process.env.NODE_PORT, () => {
      console.log("Escuchando...");
    });
    return this.server;
  }
}

/*
const productManager = new ProductManager();

// <<< EL HTTPSERVER NO SE COMO UBICARLO >>>

const socketServer = new Server(httpServer);
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("add", async (data) => {
    await productManager.addProduct(data);
    socket.emit("newList", await productManager.getProducts());
  });

  socket.on("delete", async (data) => {
    await productManager.deleteProduct(data);
    socket.emit("deleteProduct", await productManager.getProducts());
  });
});
*/

export default AppExpress;
