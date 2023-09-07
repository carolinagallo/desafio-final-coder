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

  it("Crear un cart /api/carts", async function () {
    const payload = {
      products: [
        {
          _id: "64dd22ac0290de0036a20986",
          quantity: 5,
        },
      ],
    };

    return await this.requester
      .post("/api/carts")
      .set("Authorization", `Bearer ${this.jwt}`)
      .send(payload)
      .then((result) => {
        expect(result.statusCode).to.be.equals(200);
        expect(result._body.products[0].product).to.be.equals(
          payload.products[0]._id
        );
      });
  });

  it("Traer un cart /api/carts/:pid", function () {
    const payload = "645a95d000219b9b3fef4803";

    return this.requester.get("/api/carts/" + payload).then((result) => {
      expect(result).to.be.an("object");
    });
  });

  it("Agregar un producto al carrito /api/carts/product/:pid", function () {
    const cid = "64f7b2016df50aa66f1c8194";
    const pid = "64dd22ac0290de0036a20986";

    return this.requester
      .post(`/api/carts/${cid}/product/${pid}`)
      .set("Authorization", `Bearer ${this.jwt}`)
      .then((result) => {
        expect(result.statusCode).to.be.equals(200);
        expect(result).to.be.an("object");
      });
  });

  it("Actualizar todo el carrito /api/carts/:cid", function () {
    const payload = {
      products: [
        {
          _id: "64dd22ac0290de0036a20986",
          quantity: 4,
        },
      ],
    };

    const cid = "64f7b2016df50aa66f1c8194";

    return this.requester
      .put(`/api/carts/${cid}`)
      .set("Authorization", `Bearer ${this.jwt}`)
      .send(payload)
      .then((result) => {
        expect(result.statusCode).to.be.equals(200);
        expect(result).to.be.an("object");
      });
  });

  it("Actualizar quantity /api/carts/:cid", function () {
    const payload = {
      quantity: 5,
    };

    const cid = "64f7b2016df50aa66f1c8194";
    const pid = "64dd22ac0290de0036a20986";

    return this.requester
      .put(`/api/carts/${cid}/product/${pid}`)
      .set("Authorization", `Bearer ${this.jwt}`)
      .send(payload)
      .then((result) => {
        expect(result.statusCode).to.be.equals(200);
        expect(result).to.be.an("object");
      });
  });

  it("Realizar compra del carrito /api/carts/:cid/purchase", function () {
    const cid = "64f7b2016df50aa66f1c8194";

    return this.requester
      .post(`/api/carts/${cid}/purchase`)
      .set("Authorization", `Bearer ${this.jwt}`)

      .then((result) => {
        expect(result.statusCode).to.be.equals(200);
        expect(result).to.be.an("object");
      });
  });

  it("Eliminar un producto del carrito /api/carts/:cid/product/:pid", function () {
    const cid = "64f7b2016df50aa66f1c8194";
    const pid = "64dd22ac0290de0036a20986";

    return this.requester
      .delete(`/api/carts/${cid}/product/${pid}`)
      .set("Authorization", `Bearer ${this.jwt}`)
      .then((result) => {
        expect(result.status).to.be.equal(200);
      });
  });
});
