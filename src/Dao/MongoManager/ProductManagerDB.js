import productModel from "../../models/product.model.js"


class ProductManager {

  static async readProducts() {
     await productModel.find().lean().exec()
  }

  static async getAllProducts({ limit = 10, page = 1, sort = "asc", query = {} }) {
    try {
      const filter = {}

      if (query.category) {
        filter.category = query.category
      }

      if (query.availability) {
        filter.availability = query.availability
      }

      const options = {
        page,
        limit,
        sort: { price: sort === "desc" ? -1 : 1 },
        lean: true,
      };

      const result = await productModel.paginate(filter, options)

      const totalCount = result.totalDocs
      const totalPages = result.totalPages
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null
      const prevPage = hasPrevPage ? page - 1 : null
      const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null
      const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null

      return {
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
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getProducts() {
    try {
      const result = await productModel.find().lean().exec();
      return { status: "success", payload: result };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getProductById(productId) {
    try {
      const result = await productModel.findById(productId).lean().exec();
      if (!result) {
        throw new Error("Not Found")
      }
      return { status: "success", payload: result }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async createProduct(product) {
    try {
      const result = await productModel.create(product)
      // const products = await productModel.find().lean().exec()
      // Emit the event using the appropriate socketio instance
      // req.app.get("socketio").emit("updatedProducts", products)
      return { status: "success", payload: result }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async updateProduct(productId, data) {
    try {
      const result = await productModel
        .findByIdAndUpdate(productId, data, { new: true })
        .lean()
        .exec()
      if (result === null) {
        throw new Error("Not Found");
      }
      // const products = await productModel.find().lean().exec()
      // // Emit the event using the appropriate socketio instance
      // req.app.get("socketio").emit("updatedProducts", products)
      return { status: "success", payload: result }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async deleteProduct(productId) {
    try {
      const result = await productModel.findByIdAndDelete(productId).lean().exec()
      if (result === null) {
        throw new Error("Not Found")
      }
      // const products = await productModel.find().lean().exec()
      // // Emit the event using the appropriate socketio instance
      // req.app.get("socketio").emit("updatedProducts", products)
      return { status: "success", payload: products }
    } catch (err) {
      throw new Error(err.message)
    }
  }
}



// class ProductManager {

//     async getProducts(req, res) {
//         try {
//           const limit = parseInt(req.query.limit) || 10
//           const page = parseInt(req.query.page) || 1
//           const sort = req.query.sort === "desc" ? -1 : 1
//           const query = req.query.query || {};
      
//           const filter = {};
      
//           if (query.category) {
//             filter.category = query.category;
//           }
      
//           if (query.availability) {
//             filter.availability = query.availability;
//           }
      
//           const options = {
//             page,
//             limit,
//             sort: { price: sort },
//             lean: true,
//           };
      
//           const result = await productModel.paginate(filter, options)
      
//           const totalCount = result.totalDocs;
//           const totalPages = result.totalPages;
//           const hasNextPage = page < totalPages;
//           const hasPrevPage = page > 1;
//           const nextPage = hasNextPage ? page + 1 : null;
//           const prevPage = hasPrevPage ? page - 1 : null;
//           const prevLink = hasPrevPage
//             ? `http://localhost:8080/products?page=${prevPage}&limit=${limit}`
//             : null;
//           const nextLink = hasNextPage
//             ? `http://localhost:8080/products?page=${nextPage}&limit=${limit}`
//             : null;
      
//           res.status(200).json( {
//             status: "success",
//             payload: result.docs,
//             totalPages,
//             prevPage,
//             nextPage,
//             page,
//             hasPrevPage,
//             hasNextPage,
//             prevLink,
//             nextLink,
//           })
//         } catch (err) {
//           res.status(500).json({ status: "error", error: err.message });
//         }
//       }

//         async getProductById(req, res) {
//             try {
//               const productId = req.params.pid;
//               const result = await productModel.findById(productId).lean().exec()
        
//               if (!result) {
//                 return res.status(404).json({ error: 'Not Found' });
//               }
        
//               res.status(200).json({ status: "success", payload: result });
//             } catch (err) {
//               res.status(500).json({ status: "error", error: err.message });
//             }
//           }

//           async createProduct(req, res) {
//             try {
//               const product = req.body;
//               const result = await productModel.create(product);
//               const products = await productModel.find().lean().exec();
        
//               req.app.get("socketio").emit("updatedProducts", products);
        
//               return res.status(201).json({ status: "success", payload: result });
//             } catch (err) {
//               return res.status(500).json({ status: "error", error: err.message });
//             }
//           }

//           async updateProduct(req, res) {
//             try {
//               const productId = req.params.pid;
//               const data = req.body;
        
//               const result = await productModel
//                 .findByIdAndUpdate(productId, data, { new: true })
//                 .lean()
//                 .exec();
        
//               if (result === null) {
//                 return res.status(404).json({ error: 'Not Found' });
//               }
        
//               const products = await productModel.find().lean().exec();
//               req.app.get("socketio").emit("updatedProducts", products);
        
//               res.status(200).json({ status: "success", payload: result });
//             } catch (err) {
//               res.status(500).json({ status: "error", error: err.message });
//             }
//           }

//           async deleteProduct(req, res) {
//             try {
//               const productId = req.params.pid;
        
//               const result = await productModel
//                 .findByIdAndDelete(productId)
//                 .lean()
//                 .exec();
        
//               if (result === null) {
//                 return res.status(404).json({ error: 'Not Found' });
//               }
        
//               const products = await productModel.find().lean().exec();
//               req.app.get("socketio").emit("updatedProducts", products);
        
//               res.status(200).json({ status: "success", payload: products });
//             } catch (err) {
//               res.status(500).json({ status: "error", error: err.message });
//             }
//           }

//       }

  
  export default ProductManager