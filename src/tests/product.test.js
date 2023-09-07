import { faker } from "@faker-js/faker";
import chai from "chai";
import supertest from "supertest";
import initServer from "./index.js";

const expect = chai.expect;

describe("Testing Auth Endpoints Success", () => {
  before(async function () {
    this.timeout(10000);
    const { app, db } = await initServer();
    const application = app.callback();
    this.requester = supertest.agent(application);
    this.app = app;
    this.db = db;
    this.payload = {};
    const res = await this.requester.post("/api/sessions/login").send({
      email: "CAROLINaAaaaada@coder.com",
      password: "12345",
    });

    this.jwt = res.body.accessToken;
  });

  after(async function () {
    await this.db.close();
    this.requester.app.close(() => {
      console.log("Conexión cerrada");
    });
  });

  beforeEach(async function () {
    this.timeout(10000);
  });

  it("Traer todos los productos /api/products/", function () {
    return this.requester.get("/api/products/").then((result) => {
      const { statusCode } = result;

      expect(statusCode).to.be.equals(200);
      expect(result.body).to.have.property("payload");
    });
  });

  it("Traer un producto /api/products/:pid", function () {
    const payload = "645aaceee35ba080f65d697c";

    return this.requester.get("/api/products/" + payload).then((result) => {
      expect(result).to.be.an("object");
    });
  });

  it("Crear un producto /api/products/add", async function () {
    const product = () => {
      return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.airline.flightNumber({ length: 3 }),
        code: faker.airline.flightNumber(),
        stock: faker.airline.flightNumber({ length: 3 }),
        category: faker.commerce.product(),
      };
    };
    const payload = product();

    return await this.requester

      .post("/api/products/add")
      .set("Authorization", `Bearer ${this.jwt}`)
      .field(payload)
      .attach("thumbnail", "public/img/file.jpg", {
        contentType: "file",
        filename: payload.title + ".jpeg",
      })

      .then((result) => {
        expect(result.statusCode).to.be.equals(200);
        expect(result._body.title).to.be.equals(payload.title);
      });
  });

  it("Modificar un producto /api/products/update/:pid", function () {
    const payload = {
      id: "64f77ff0d44ab181d5a5d7e0",
      title: "modificado",
    };

    return this.requester
      .put(`/api/products/update/${payload.id}`)
      .set("Authorization", `Bearer ${this.jwt}`)
      .send(payload)
      .then((result) => {
        expect(result._body.id).to.be.equals(payload.id);
        expect(result._body.title).to.be.equal(payload.title);
      });
  });

  it("Eliminar un producto /api/products/delete/:pid", function () {
    const payload = {
      id: "64f77ff0d44ab181d5a5d7e0",
    };

    return this.requester
      .delete(`/api/products/delete/${payload.id}`)
      .set("Authorization", `Bearer ${this.jwt}`)
      .then((result) => {
        expect(result._body.massage).to.be.equals("product deleted");
        expect(result._body.status).to.be.equal("success");
        expect(result.status).to.be.equal(200);
      });
  });

  it("Test de error de traer todos los productos /api/products/", function () {
    return this.requester.get("/api/products/").then((result) => {
      const { statusCode } = result;

      expect(statusCode).to.be.equals(201);
      expect(result.body).to.have.property("productos");
    });
  }).timeout(5000);
});
