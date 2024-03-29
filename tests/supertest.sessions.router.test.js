import chai from "chai";
import supertest from "supertest";
import { PORT, SIGNED_COOKIE_KEY } from "../src/config/config.js";
import { faker } from "@faker-js/faker";

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing E-Commerce - Rutas de sessions", () => {
  let cookie;
  const mockUser = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 99 }),
    password: "1234",
  };
  it("Debe registrar un usuario", async () => {
    try {
      const response = await requester.post("/session/register").send(mockUser);
      expect(response.status).to.equal(302);
    } catch (error) {
      throw error;
    }
  });

  it("Debe loggear un usuario y devolver una cookie", async () => {
    try {
      const result = await requester.post("/session/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });
      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql(SIGNED_COOKIE_KEY);
      expect(cookie.value).to.be.ok;
    } catch (error) {
      throw error;
    }
  });

  it("El Endpoint GET /api/session/current debe devolver el perfil del usuario loggeado", async () => {
    try {
      const response = await requester
        .get("/session/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(response.status).to.equal(200);
    } catch (error) {
      throw error;
    }
  });
});