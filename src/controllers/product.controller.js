import UserDTO from "../dto/user.dto.js"
import productModel from "../models/product.model.js"
import { ProductService } from '../services/index.js'



export const getProductsWithLimit =  async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1
    const sort = req.query.sort === "desc" ? -1 : 1
    const query = req.query.query || {};

    const filter = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.availability) {
      filter.availability = query.availability;
    }

    const options = {
      page,
      limit,
      sort: { price: sort },
      lean: true,
    };

    // const result = await productModel.paginate(filter, options) // paginate
    const result = await ProductService.getFilter(filter, options)

    const totalCount = result.totalDocs;
    const totalPages = result.totalPages;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;
    const prevLink = hasPrevPage
      ? `http://localhost:8080/products?page=${prevPage}&limit=${limit}`
      : null;
    const nextLink = hasNextPage
      ? `http://localhost:8080/products?page=${nextPage}&limit=${limit}`
      : null;

    res.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
      // user
    })
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
}


export const getProductsController = async (req, res) => {
  try {
    // const productManager = new ProductManager()
    // const products = await productModel.find().lean().exec()// await getall
    const products = await ProductService.getAll()
    res.status(200).json({ status: "success", payload: products })
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
}


export const getProductByIdController = async (req, res) => {
  try {
    const productId = req.params.pid
    // const result = await productModel.findById(productId).lean().exec(); // getbyid
    const result = await ProductService.getById(productId)
    res.status(200).json({status: "success", payload: result})
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
}


export const createProductController = async (req, res) => {
  try {
    const product = req.body;
    // const result = await productModel.create(product)
    // const products = await productModel.find().lean().exec()
    const result = await ProductService.create(product)
    const products = await ProductService.getAll()
    req.app.get("socketio").emit("updatedProducts", products)
    res.status(200).json({status: "success", payload: result})
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
}


export const updateProductController = async (req, res) => {
  try {
    const productId = req.params.pid
    const data = req.body
    // const result = await productModel.findByIdAndUpdate(productId, data, { new: true }).lean().exec()
    const result = await ProductService.update(productId, data)
    if (result === null) {
      throw new Error("Not Found");
    }
    // const products = await productModel.find().lean().exec()
    const products = await ProductService.getAll()
    req.app.get("socketio").emit("updatedProducts", products)
    res.status(200).json({status: "success", payload: result})
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
}



export const deleteProductController = async (req, res) => {
    try {
      const productId = req.params.pid
      // const result = await productModel.findByIdAndDelete(productId).lean().exec()
      const result = await ProductService.delete(productId)

      if (result === null) {
        return res.status(404).json({ error: 'Not Found' });
      }

      // const products = await productModel.find().lean().exec();
      const products = await ProductService.getAll()
      req.app.get("socketio").emit("updatedProducts", products);

      res.status(200).json({ status: "success", payload: products });
    } catch (err) {
      res.status(500).json({ status: "error", error: err.message });
    }
  }

