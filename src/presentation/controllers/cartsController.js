import CartManager from "../../domain/managers/carts.js";
import ProductManager from "../../domain/managers/products.js";
import TicketManager from "../../domain/managers/tickets.js";
import UserManager from "../../domain/managers/users.js";

export const createCart =
  ("/",
  async (req, res) => {
    const cartManager = new CartManager();
    const productManager = new ProductManager();
    const userManager = new UserManager();

    const data = req.body;
    const products = data.products;

    if (!products) {
      const cart = await cartManager.addCart([]);
      return res.send(cart);
    }

    const extistingProducts = [];

    for (const product of products) {
      const existingProduct = await productManager.getProductById(
        String(product._id)
      );
      if (existingProduct)
        extistingProducts.push({
          _id: product._id,
          quantity: product.quantity,
        });
      else return res.status(404).send(`Product no exist id: ${product._id}`);
    }

    data.products = extistingProducts;

    const user = req.body.user;
    if (!user) {
      return res.status(404).send(`User is required`);
    }

    const newCart = await cartManager.addCart(data);

    await userManager.updateOne(user._id, { cart: newCart._id });

    res.send(newCart);
  });

export const findCartById =
  ("/:cid",
  async (req, res) => {
    const cartManager = new CartManager();

    const cid = String(req.params.cid);
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).send("Cart no exist");
    res.send(cart);
  });

export const addProduct =
  ("/:cid/product/:pid",
  async (req, res) => {
    const cartManager = new CartManager();
    const productManager = new ProductManager();

    const cid = String(req.params.cid);
    const pid = String(req.params.pid);

    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).send("Cart no exist");

    const productCart = cart.products.find((product) => product?._id == pid);

    if (!productCart) {
      const product = await productManager.getProductById(pid);

      if (!product || req.user.email == product.owner)
        return res.status(404).send("Product not accessible");
      cart.products.push({ _id: pid, quantity: 1 });
    }

    const updateCart = await cartManager.addProduct(cid, pid);
    res.send(updateCart);
  });

export const deleteProduct =
  ("/:cid/product/:pid",
  async (req, res) => {
    const cartManager = new CartManager();

    const cid = String(req.params.cid);
    const pid = String(req.params.pid);

    const cart = await cartManager.getCartById(cid);

    const productCart = cart.products.find((product) => product?.id._id == pid);

    if (!productCart) return res.status(404).send("Product no exist");

    const productDeleted = await cartManager.deleteOneProduct(cid, pid);

    res.send(productDeleted);
  });

export const deleteProducts =
  ("/:cid",
  async (req, res) => {
    const cartManager = new CartManager();

    const cid = String(req.params.cid);

    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).send("Cart no exist");

    const updatedCart = await cartManager.deleteAllProducts(cid);
    res.send(updatedCart);
  });

export const updateAllProducts =
  ("/:cid",
  async (req, res) => {
    const cartManager = new CartManager();

    const cid = String(req.params.cid);

    const { products } = req.body;

    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).send("Cart no exist");

    const newCart = await cartManager.changeAllProducts(cid, products);
    res.send(newCart);
  });

export const updateQuantity =
  ("/:cid/products/:pid",
  async (req, res) => {
    const cartManager = new CartManager();

    const { quantity } = req.body;
    const cid = String(req.params.cid);
    const pid = String(req.params.pid);

    const cart = await cartManager.getCartById(cid);

    if (!cart) return res.status(404).send("Cart no exist");
    const productCart = cart.products.find((product) => product?.id._id == pid);

    if (!productCart)
      return res.status(404).send("Product no exist in the cart");

    const newQuantity = await cartManager.changeQuantity(cid, pid, quantity);

    res.send(newQuantity);
  });

export const purchase =
  ("/:cid/purchase",
  async (req, res) => {
    const ticketManager = new TicketManager();

    const cid = String(req.params.cid);
    const user = req.user;

    const purchasedCart = await ticketManager.purchaseCart(cid, user);

    res
      .status(200)
      .send({ status: "Successful purchase", payload: purchasedCart });
  });
