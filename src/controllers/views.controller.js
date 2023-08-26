import productModel from "../models/product.model.js";
import messageModel from "../models/chat.model.js";
import cartModel from "../models/cart.model.js";

const renderCommonView = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "desc" ? -1 : 1;
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
    }

    const user = {
    //   first_name: req.user.first_name,
    //   last_name: req.user.last_name,
    //   email: req.user.email,
    //   role: req.user.role,
      cart: req.user.cart,
    }

    const result = await productModel.paginate(filter, options);

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

    const payload = result.docs;

    return {
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      prevLink,
      nextLink,
      payload,
      user
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const productsViewController = async (req, res) => {
  try {
    const viewData = await renderCommonView(req, res);
    
    res.status(200).render("home", {
      status: "success",
      ...viewData,
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const realTimeProductsViewController = async (req, res) => {
  try {
    const viewData = await renderCommonView(req, res);
    
    res.status(200).render("realtimeproducts", {
      status: "success",
      payload: viewData.payload.map((product) => ({
        ...product,
        showDeleteButton: true,
      })),
      ...viewData,
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};


export const chatViewController = async (req, res) => {
  try {
    const user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    };
    const messages = await messageModel.find().lean().exec();
    res.render("chat", { user, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const cartViewController = async (req, res) => {
  try {
    const cid = req.params.cid;

    const user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart,
    };

    const result = await cartModel
      .findById(cid)
      .populate("products.product")
      .lean()
      .exec();
    res.render("carts", { cid: result._id, products: result.products, user });
  } catch (error) {
    console.error(error);
    res.status(404).send("Carrito no encontrado");
  }
};


