import ProductManager from "../../domain/managers/products.js";

export const getAllProducts =
  ("/",
  async (req, res) => {
    try {
      const productManager = new ProductManager();

      const limit = Number(req.query.limit ?? 10);
      const type = req.query.type ? String(req.query.type) : null;
      const sortOrder = req.query.sortOrder
        ? Number(req.query.sortOrder)
        : null;
      const stock = req.query.stock ? Number(req.query.stock) : 0;

      const productsFiltered = await productManager.getProducts(
        type,
        sortOrder,
        limit,
        stock
      );

      if (productsFiltered.length === 0) {
        throw new Error("No se pudo filtrar ningun producto");
      } else {
        res.send({
          status: "success",
          payload: productsFiltered,
        });
      }
    } catch (error) {
      res.status(404).send(error.message);
    }
  });

export const getOneById =
  ("/:pid",
  async (req, res) => {
    try {
      const productManager = new ProductManager();

      const id = String(req.params.pid);

      const productId = await productManager.getProductById(id);

      if (!productId) throw new Error("Product no exist");
      res.send(productId);
    } catch (error) {
      res.status(404).send(error.message);
    }
  });

export const uploaderProduct =
  ("/add",
  async (req, res) => {
    //Los datos del producto fueron pasados por form-data.
    try {
      const data = req.body;

      if (!data) throw new Error("No product");

      if (!req.file) {
        throw new Error("Could not save image");
      }

      const img = `http://localhost:8084/${req.file.path.replace(
        "public/",
        ""
      )}`;

      data.thumbnail = img;

      if (!req.user.email) {
        data.owner = "admin";
      }
      data.owner = req.user.email;

      const productManager = new ProductManager();
      const product = await productManager.addProduct(data);

      res.send(product);
    } catch (error) {
      res.status(404).send(error.message);
    }
  });

export const updateOneProduct =
  ("/update/:pid",
  async (req, res) => {
    try {
      const productManager = new ProductManager();

      const id = String(req.params.pid);
      const data = req.body;

      const product = await productManager.updateProduct(id, data);
      if (!data) throw new Error("No product");
      res.send(product);
    } catch (error) {
      res.status(404).send(error.message);
    }
  });

export const deleteById =
  ("/delete/:pid",
  async (req, res) => {
    try {
      const productManager = new ProductManager();

      const id = String(req.params.pid);
      const email = req.user.email;

      const deleteElement = await productManager.deleteProduct(id, email);

      if (!deleteElement) throw new Error("Product no exist");
      res.send({ status: "success", massage: "product deleted" });
    } catch (error) {
      res.status(404).send(error.message);
    }
  });
