import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const productManager = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit;

  const products = await productManager.getProducts();

  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
  } else {
    res.json({ products: products });
  }
});

router.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);
  if (!product) {
    return res.status(404).json({
      error: `El producto con el id ${productId} no se ha encontrado`,
    });
  }
  res.json({ product: product });
});

router.post("/", async (req, res) => {
  try {
    let {
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock,
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const addProduct = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      category,
      stock
    );

    if (addProduct) {
      const products = await productManager.getProducts();
      req.app.get("socketio").emit("updatedProducts", products);

      return res.status(201).json({
        message: "Producto agregado exitosamente",
        product: addProduct,
      });
    }

    return res.status(404).json({ error: "Error al agregar el producto" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error en el servidor" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const products = await productManager.getProducts();
    if (req.body.id !== productId && req.body.id !== undefined) {
      return res
        .status(404)
        .json({ error: "No se puede modificar el id del producto" });
    }

    const updated = req.body;
    const productFind = await products.find((prod) => prod.id === productId);
    if (!productFind) {
      return res
        .status(404)
        .json({ error: `No existe el producto con el id: ${productId}` });
    }

    await productManager.updateProduct(productId, updated);

    const updatedProducts = await productManager.getProducts();

    req.app.get("socketio").emit("updatedProducts", updatedProducts);
    res.json({ message: `Actualizando el producto con el id: ${productId}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const products = await productManager.getProducts();
    const productFind = await products.find((prod) => prod.id === productId);
    if (!productFind) {
      return res
        .status(404)
        .json({ error: `No existe el producto con el id: ${productId}` });
    }
    const deleteProduct = await productManager.deleteProduct(productId);
    console.log(deleteProduct);
    const updatedProducts = await productManager.getProducts();
    req.app.get("socketio").emit("updatedProducts", updatedProducts);
    res.json({
      message: `Producto con el id ${productId} eliminado con exito`,
      products: await productManager.getProducts(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router
