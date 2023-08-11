import { Router } from "express";
import productModel from "../models/product.model.js";
import messageModel from "../models/chat.model.js";
import UserModel from '../models/user.model.js'
import cartModel from "../models/cart.model.js";


const router = Router()


router.get("/",  async (req, res) => {
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

    const result = await productModel.paginate(filter, options)

    const user = {
      first_name : req.user.first_name,
      last_name : req.user.last_name,
      email : req.user.email,
      role : req.user.role,
      cart: req.user.cart
    }



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

    res.status(200).render( "home", {
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
      user
    })
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
})

router.get("/realtimeproducts", async (req, res) => {
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
  };

  const result = await productModel.paginate(filter, options);

  const user = {
    first_name : req.user.first_name,
    last_name : req.user.last_name,
    email : req.user.email,
    role : req.user.role
  }

  const totalCount = result.totalDocs;
  const totalPages = result.totalPages;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;
  const prevLink = hasPrevPage
    ? `http://localhost:8080/products/realtimeproducts?page=${prevPage}&limit=${limit}`
    : null;
  const nextLink = hasNextPage
    ? `http://localhost:8080/products/realtimeproducts?page=${nextPage}&limit=${limit}`
    : null;

  const payload = result.docs.map(product => ({
    ...product,
    showDeleteButton: true
  }));

  res.status(200).render("realtimeproducts", {
    status: "success",
    payload,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
    user
  });
} catch (err) {
  res.status(500).json({ status: "error", error: err.message });
}
})

router.get("/chat", async (req, res) => {
  try {
    const user = {
      first_name : req.user.first_name,
      last_name : req.user.last_name,
      email : req.user.email,
      role : req.user.role
    }
    const messages = await messageModel.find().lean().exec();
    res.render("chat", { user, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const cid = req.params.cid

    const user = {
      first_name : req.user.first_name,
      last_name : req.user.last_name,
      email : req.user.email,
      role : req.user.role,
      cart: req.user.cart
    }

    const result = await cartModel.findById(cid).populate('products.product').lean().exec()
    res.render('carts', { cid: result._id, products: result.products, user })
  } catch (error) {
      console.error(error);
      res.status(404).send('Carrito no encontrado');
  }
})



export default router
