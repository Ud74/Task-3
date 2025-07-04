const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory products array
let products = [];

// helper to generate random ID
function generateId() {
  return Math.floor(Math.random() * 1000000);
}

// valid stock statuses
const validStockStatuses = ["in-stock", "low-stock", "out-of-stock"];

/**
 * GET /products
 * Returns all products
 */
app.get("/products", (req, res) => {
  res.json(products);
});

/**
 * GET /products/:id
 * Get product by ID
 */
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

/**
 * POST /products
 * Add a new product
 */
app.post("/products", (req, res) => {
  const { productName, cost, stockStatus } = req.body;

  if (
    !productName ||
    typeof cost !== "number" ||
    !validStockStatuses.includes(stockStatus)
  ) {
    return res
      .status(400)
      .json({ error: "Invalid product data or stock status" });
  }

  const newProduct = {
    id: generateId(),
    productName,
    cost,
    stockStatus,
    createdAt: new Date(),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * PATCH /products/:id
 * Edit product (except stockStatus)
 */
app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { productName, cost } = req.body;

  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (productName) product.productName = productName;
  if (typeof cost === "number") product.cost = cost;

  res.json(product);
});

/**
 * PATCH /products/:id/:status
 * Change stock status only
 */
app.patch("/products/:id/:status", (req, res) => {
  const id = parseInt(req.params.id);
  const newStatus = req.params.status;

  if (!validStockStatuses.includes(newStatus)) {
    return res.status(400).json({ error: "Invalid stock status" });
  }

  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  product.stockStatus = newStatus;

  res.json(product);
});

/**
 * DELETE /products/:id
 * Delete a product by ID
 */
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deleted = products.splice(index, 1)[0];
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Provision Store API running at http://localhost:${PORT}`);
});
