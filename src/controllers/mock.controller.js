import { createProduct, generateProduct } from "../services/mockService.js";
import CustomError from "../services/errors/custom_error.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

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

export const createProductController = async (req, res) => {
  try {
    const product = await createProduct(req);

    if (!product.title || !product.price || !product.code || !product.category) {

      throw CustomError.createError({
        name: "Product create error",
        cause: generateProductErrorInfo(product),
        message: "Error when trying to create a product",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    } else {
      res.status(200).json({ status: 'success', payload: product });
    }
  } catch (error) {
    if (error.code === EErrors.INVALID_TYPES_ERROR) {
      res.status(400).json({ status: "error", message: error.message, details: error.cause });
    } else {
      res.status(500).json({ status: "error", message: "Error interno del servidor", details: error.message });
    }
  }
};