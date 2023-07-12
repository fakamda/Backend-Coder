import { Router } from "express";
import productModel from "../models/product.model.js";
import messageModel from "../models/chat.model.js";
import ProductManager from "../Dao/MongoManager/ProductManagerDB.js";
import cartModel from "../models/cart.model.js";
import CartManager from "../Dao/MongoManager/CartManagerDB.js";

// const productManager = new ProductManager()

const cartManager = new CartManager()

const router = Router()

router.get("/", async (req, res) => {
  // try {
  //   // const products = await productModel.find().lean().exec()
  //  const products = await productManager.getProducts(req, res)
  //   res.render("home", { products })
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ status: 'error', error: error.message });
  // }

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
    })
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
})

router.get("/realtimeproducts", async (req, res) => {
  try {
    const payload = await productModel.find().lean().exec()
    res.render('realTimeProducts', { payload })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: error.message })
  }
  // try {
  //   const limit = parseInt(req.query.limit) || 10
  //   const page = parseInt(req.query.page) || 1
  //   const sort = req.query.sort === "desc" ? -1 : 1
  //   const query = req.query.query || {};

  //   const filter = {};

  //   if (query.category) {
  //     filter.category = query.category;
  //   }

  //   if (query.availability) {
  //     filter.availability = query.availability;
  //   }

  //   const options = {
  //     page,
  //     limit,
  //     sort: { price: sort },
  //     lean: true,
  //   };

  //   const result = await productModel.paginate(filter, options)

  //   const totalCount = result.totalDocs;
  //   const totalPages = result.totalPages;
  //   const hasNextPage = page < totalPages;
  //   const hasPrevPage = page > 1;
  //   const nextPage = hasNextPage ? page + 1 : null;
  //   const prevPage = hasPrevPage ? page - 1 : null;
  //   const prevLink = hasPrevPage
  //     ? `http://localhost:8080/products?page=${prevPage}&limit=${limit}`
  //     : null;
  //   const nextLink = hasNextPage
  //     ? `http://localhost:8080/products?page=${nextPage}&limit=${limit}`
  //     : null;

  //   res.status(200).render( "realtimeproducts", {
  //     status: "success",
  //     payload: result.docs,
  //     totalPages,
  //     prevPage,
  //     nextPage,
  //     page,
  //     hasPrevPage,
  //     hasNextPage,
  //     prevLink,
  //     nextLink,
  //   })
  // } catch (err) {
  //   res.status(500).json({ status: "error", error: err.message });
  // }
})

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageModel.find().lean().exec();
    res.render("chat", { messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
})


// router.get("/carts", async (req, res) => {
//   try {
//     const carts = await cartModel.find().lean().exec()
//     res.render("carts", { carts })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error})
//   }
// })



// router.get("/carts", async (req, res) => {
//   try {
//     const carts = await cartManager.getCarts();
//     res.render("carts", { carts });
//   } catch (error) {
//     console.error(error);
//     res.status(500).render("error", { error: error.message });
//   }
// });

// // GET request to retrieve a specific cart by ID
// router.get("/:cid", async (req, res) => {
//   try {
//     const cartId = req.params.cid;
//     const cart = await cartManager.getCartById(cartId);
//     res.render("cart", { cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).render("error", { error: error.message });
//   }
// });

router.get('/carts', async (req, res) => {
  try {
      const carts = await cartManager.getCarts();
      res.render('carts', { carts }); // Renderiza la plantilla "carts.hbs" y pasa los datos de los carritos
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos de los carritos');
  }
});

router.get('/carts/:cartId', async (req, res) => {
  const { cartId } = req.params
  try {
      const cart = await cartManager.getCartById(cartId)
      res.render('carts', { cart }) // Renderiza la plantilla "cart.hbs" y pasa los datos del carrito
  } catch (error) {
      console.error(error);
      res.status(404).send('Carrito no encontrado');
  }
});



// router.get('/chat', (req, res) => {
//   res.render('chat', {})
// })

export default router
