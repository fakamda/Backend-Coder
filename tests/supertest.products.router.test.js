import chai from "chai";
import supertest from "supertest";
import { PORT, SIGNED_COOKIE_KEY, ADM_PASS, ADM_USER } from '../src/config/config.js'
import { faker } from "@faker-js/faker"


const expect = chai.expect
const requester = supertest(`http://localhost:${PORT}`)

describe('Testing of E-commerce - Product Routes', () => {
    let cookie
    const user = {
        email: ADM_USER,
        password: ADM_PASS
    }
    const newProduct = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 1000 }),
        code: faker.string.alphanumeric(8),
        category: faker.commerce.productName(),
        stock: faker.number.int(50),
        status: faker.datatype.boolean()
    }

    it("You must log an user to see the products", async () => {
        const result = await requester.post('/api/session/login').send(user)
        const cookieResult = result.headers["set-cookie"][0]
        expect(cookieResult).to.be.ok
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }
        expect(cookie.name).to.be.ok.and.eql(SIGNED_COOKIE_KEY)
        expect(cookie.value).to.be.ok
    })

    it("The endpoint GET /api/products must obtain all products", async () => {
        const response = await requester
            .get('/api/products')
            .set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(response.status).to.be.eql(200)
        expect(response.body.payload).to.be.an('array')
        expect(response.body.payload).to.have.lengthOf.above(0)
    })

    it("The endpoint GET /api/products/:id must obtain a product by it ID", async () => {
        const pid = "64a8b6dc128db523144a7c84"
        const response = await requester
            .get(`/api/products/${pid}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`])
        expect(response.status).to.be.eql(200)
        expect(response.body.payload).to.have.property("_id").equal(pid)
        expect(response.body.payload).to.have.property("title")
    })

    it("The endpoint POST /api/products must create a product", async () => {
        const response = await requester
            .post('/api/products')
            .set('cookie', [`${cookie.name}=${cookie.value}`])
            .send(newProduct)
        expect(response.status).to.be.eql(201)
        expect(response.body.payload).to.have.property("_id")
        expect(response.body.payload).to.have.property("title").eql(newProduct.title)
    })

})