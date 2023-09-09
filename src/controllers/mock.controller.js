import { createProduct, generateProduct } from "../services/mockService.js";

const products = []

export const getProductsController = async (req, res) => {
    try {
        for(let i = 0; i < 100; i++ ) {
            products.push(await generateProduct())
        }
        res.status(200).json({status: "success", payload: products })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: "error", error: error.message })
    }
}


export const createProductController = async (req, res, next) => {
    try {
        const product = await createProduct(req)
        products.push(product)
        res.status(201).json({ status: "success", payload: products })
    } catch (error) {
        next(error)
    }
}