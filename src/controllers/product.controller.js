import { ProductService } from '../services/index.js'
import EErrors from '../services/errors/enums.js'
import CustomError from '../services/errors/custom_error.js'
import { generateProductErrorInfo } from '../services/errors/info.js'



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

    const products = await ProductService.getAll()
    res.status(200).json({ status: "success", payload: products })
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
}


export const getProductByIdController = async (req, res) => {
  try {
    const productId = req.params.pid
    const result = await ProductService.getById(productId)
    res.status(200).json({status: "success", payload: result})
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
}


export const createProductController = async (req, res) => {
  try {
    const product = req.body;
    
     product.owner =
     req.user.user && req.user.user.role === "premium"
       ? req.user.user._id
       : "admin";

    const result = await ProductService.create(product)
    const products = await ProductService.getAll()
    req.app.get("socketio").emit("updatedProducts", products)
    
    if (!product.title || !product.price || !product.code || !product.category) {

      throw CustomError.createError({
        name: "Product create error",
        cause: generateProductErrorInfo(product),
        message: "Error when trying to create a product",
        code: EErrors.INVALID_TYPES_ERROR,
      })

      

    } else {
      res.status(200).json({status: "success", payload: result})
    }
  } catch (error) {
    if (error.code === EErrors.INVALID_TYPES_ERROR) {
      res.status(400).json({ status: "error", message: error.message, details: error.cause });
    } else {
      res.status(500).json({ status: "error", message: "Error interno del servidor", details: error.message });
    }
  }
}


export const updateProductController = async (req, res) => {
  try {
    const user = req.user.user
    const productId = req.params.pid
    const data = req.body
    console.log(user)

    if(user.role === 'premium') {
      const product = await ProductService.getById(productId)
      if(product.owner !== user.email) {
        return res.status(403).json({ stauts: 'error', error: 'Not authorized!' })
      }
    }

    const result = await ProductService.update(productId, data)
    if (result === null) {
      throw new Error("Not Found");
    }

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
      const user = req.user.user
      console.log(user)
      if(user.role === 'premium') {
        const product = await ProductService.getById(productId)
        if(product.owner !== user.email) {
          return res.status(403).json({ stauts: 'error', error: 'Not authorized!' })
        }
      }

      const result = await ProductService.delete(productId)

      if (result === null) {
        return res.status(404).json({ error: 'Not Found' });
      }

      const products = await ProductService.getAll()
      req.app.get("socketio").emit("updatedProducts", products);

      res.status(200).json({ status: "success", payload: products });
    } catch (err) {
      res.status(500).json({ status: "error", error: err.message });
    }
  }

