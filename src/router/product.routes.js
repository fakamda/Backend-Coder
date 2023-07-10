// import { Router } from "express";
// import productModel from "../models/product.model.js";


// const router = Router();

// router.get("/", async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10
//     const page = parseInt(req.query.page) || 1
//     const sort = req.query.sort === "desc" ? -1 : 1
//     const query = req.query.query || {}

//     const filter = {};

//     if (query.category) {
//       filter.category = query.category
//     }

//     if (query.availability) {
//       filter.availability = query.availability
//     }

//     const options = {
//       page,
//       limit,
//       sort: { price: sort },
//       lean: true
//     }

//     const result = await productModel.paginate(filter, options);

//     const totalCount = result.totalDocs;
//     const totalPages = result.totalPages;
//     const hasNextPage = page < totalPages;
//     const hasPrevPage = page > 1;
//     const nextPage = hasNextPage ? page + 1 : null
//     const prevPage = hasPrevPage ? page - 1 : null
//     const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null
//     const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null

//     res.status(200).json({
//       status: "success",
//       payload: result.docs,
//       totalPages,
//       prevPage,
//       nextPage,
//       page,
//       hasPrevPage,
//       hasNextPage,
//       prevLink,
//       nextLink,
//     })
//   } catch (err) {
//     res.status(500).json({ status: "error", error: err.message });
//   }
// })


// router.get("/:pid", async (req, res) => {
//   try {
//     const productId = req.params.pid
//     const result = await productModel.findById(productId).lean().exec()
//     if (!result) {
//       return res.status(404).json({ error: 'Not Found' })
//     }
//     res.status(200).json({ status: "success", payload: result })
//   } catch (err) {
//     res.status(500).json({ status: "error", error: err.message })
//   }
// })

// router.post("/", async (req, res) => {
//   try {
//     const product = req.body
//     const result = await productModel.create(product)
//     const products = await productModel.find().lean().exec()
//     req.app.get("socketio").emit("updatedProducts", products)
//     return res.status(201).json({status: "success", payload: result })
//   } catch (err) {
//     return res.status(500).json({ status: "error", error: err.message })
//   }
// })

// router.put("/:pid", async (req, res) => {
//   try {
//     const productId = req.params.pid
//     const data = req.body
//     const result = await productModel.findByIdAndUpdate(productId, data, { new: true }).lean().exec()
//     if (result === null) {
//       return res.status(404).json({ error: 'Not Found' })
//     }
//     const products = await productModel.find().lean().exec()
//     req.app.get("socketio").emit("updatedProducts", products)
//     res.status(200).json({ status: "success", payload: result })
//   } catch (err) {
//     res.status(500).json({ status: "error", error: err.message })
//   }
// })

// router.delete("/:pid", async (req, res) => {
//   try {
//     const productId = req.params.pid
//     const result = await productModel.findByIdAndDelete(productId).lean().exec()
//     if (result === null) {
//       return res.status(404).json({ error: 'Not Found' })
//     }
//     const products = await productModel.find().lean().exec()
//     req.app.get("socketio").emit("updatedProducts", products)
//     res.status(200).json({ status: "success", payload: products })
//   } catch (err) {
//     res.status(500).json({ status: "error", error: err.message })
//   }
// })

// export default router

import { Router } from "express";
import ProductManager from "../Dao/MongoManager/ProductManagerDB.js"


const productManager = new ProductManager()

const router = Router()


router.get("/", async (req, res) => {
  await productManager.getProducts(req, res)
})

router.get("/:pid", async (req, res) => {
  await productManager.getProductById(req, res)
})

router.post("/", async (req, res) => {
  await productManager.createProduct(req, res);
})

router.put("/:pid", async (req, res) => {
  await productManager.updateProduct(req, res);
})

router.delete("/:pid", async (req, res) => {
  await productManager.deleteProduct(req, res);
})


// router.post("/", async (req, res) => {
//   try {
//     const product = req.body
//     const result = await productManager.createProduct(product);
//     const products = await productManager.getAllProducts();

//     req.app.get("socketio").emit("updatedProducts", products);

//     return res.status(201).json({ status: "success", payload: result });
//   } catch (err) {
//     return res.status(500).json({ status: "error", error: err.message });
//   }
// })

export default router
