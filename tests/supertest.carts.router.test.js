import chai from "chai";
import supertest from "supertest";
import { PORT, SIGNED_COOKIE_KEY, ADM_PASS, ADM_USER } from "../src/config/config.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing E-Commerce - Rutas de Carrito", () => {
  let cookie;
  const user = {
    email: ADM_USER,
    password: ADM_PASS,
  };
  const userCart = "6546fb6d340e7a7f64f9440e";
  const productID = "64a8b6dc128db523144a7c84";

  it("You must log an user to see the products", async () => {
    const result = await requester.post("/session/login").send(user);
    const cookieResult = result.headers["set-cookie"][0];
    expect(cookieResult).to.be.ok;
    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };
    expect(cookie.name).to.be.ok.and.eql(SIGNED_COOKIE_KEY);
    expect(cookie.value).to.be.ok;
  });

  it("The Endpoint GET /api/carts/:cid Must obtain a cart by its ID", async () => {
    const response = await requester
      .get(`/api/carts/${userCart}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(response.status).to.equal(200);
    expect(response.body.payload.cart).to.have.property("_id").equal(userCart);
  });

  it("The Endpoint POST /api/carts/:cid/product/:pid must add a product to user cart", async () => {
    const response = await requester
      .post(`/api/carts/${userCart}/product/${productID}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property("_id").equal(userCart);
  });

  it("The Endpoint DELETE /api/carts/:cid/products/:pid must delete a product from user cart", async () => {
    const response = await requester
      .delete(`/api/carts/${userCart}/products/${productID}`)
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);
    expect(response.status).to.equal(200);
  })
});