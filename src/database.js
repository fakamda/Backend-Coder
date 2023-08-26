import { MONGO_URI, MONGO_DB_NAME } from "./config/config.js"
import mongoose from "mongoose"

export default class MongoConnection {
    static #instance
    
    constructor() {
        mongoose.connect(MONGO_URI, {
            dbName: MONGO_DB_NAME,
            useUnifiedTopology: true
           })
    }

    static getInstance() {
        if (this.#instance) {
            console.log('Already connected!')
            return this.#instance
        }

        this.#instance = new MongoConnection()
        console.log('Db Connected')
        return this.#instance
    }
}