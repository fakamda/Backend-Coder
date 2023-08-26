import productModel from "../../models/product.model.js"


class ProductManager {

  static async readProducts() {
     await productModel.find().lean().exec()
  }

  // static async getAllProducts({ limit = 10, page = 1, sort = "asc", query = {} }) {
  //   try {
  //     const filter = {}

  //     if (query.category) {
  //       filter.category = query.category
  //     }

  //     if (query.availability) {
  //       filter.availability = query.availability
  //     }

  //     const options = {
  //       page,
  //       limit,
  //       sort: { price: sort === "desc" ? -1 : 1 },
  //       lean: true,
  //     }

  //     const result = await productModel.paginate(filter, options)

  //     const totalCount = result.totalDocs
  //     const totalPages = result.totalPages
  //     const hasNextPage = page < totalPages;
  //     const hasPrevPage = page > 1;
  //     const nextPage = hasNextPage ? page + 1 : null
  //     const prevPage = hasPrevPage ? page - 1 : null
  //     const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null
  //     const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null

  //     return {
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
  //     };
  //   } catch (err) {
  //     throw new Error(err.message);
  //   }
  // }

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
      return { status: "success", payload: products }
    } catch (err) {
      throw new Error(err.message)
    }

  }

}
  export default ProductManager