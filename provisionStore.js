class ProvisionStore {
  #shopName;
  #location;

  constructor(shopName, location) {
    this.#shopName = shopName;
    this.#location = location;
    this.products = []; // array of products
  }

  // helper method to generate random ID
  generateId() {
    return Math.floor(Math.random() * 1000000);
  }

  // method to list all products
  listProducts() {
    return this.products;
  }

  // method to get product by ID
  getProductById(id) {
    return this.products.find((product) => product.id === id) || null;
  }

  // method to add a new product
  addProduct(productName, cost, stockStatus) {
    const validStockStatuses = ["in-stock", "low-stock", "out-of-stock"];
    if (!validStockStatuses.includes(stockStatus)) {
      throw new Error(
        `Invalid stock status. Allowed: ${validStockStatuses.join(", ")}`
      );
    }

    const newProduct = {
      id: this.generateId(),
      productName,
      cost,
      stockStatus,
      createdAt: new Date(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // method to edit product properties (except stockStatus) by ID
  editProduct(id, updatedFields) {
    const product = this.getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    if ("productName" in updatedFields)
      product.productName = updatedFields.productName;
    if ("cost" in updatedFields) product.cost = updatedFields.cost;

    return product;
  }

  // method to update only stockStatus by ID
  updateStockStatus(id, newStockStatus) {
    const validStockStatuses = ["in-stock", "low-stock", "out-of-stock"];
    if (!validStockStatuses.includes(newStockStatus)) {
      throw new Error(
        `Invalid stock status. Allowed: ${validStockStatuses.join(", ")}`
      );
    }

    const product = this.getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    product.stockStatus = newStockStatus;
    return product;
  }

  // method to delete product by ID
  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    const deleted = this.products.splice(index, 1)[0];
    return deleted;
  }
}

// Example usage:
const store = new ProvisionStore("Anie’s Store", "Lagos");

// Add products
const prod1 = store.addProduct("Rice", 20000, "in-stock");
const prod2 = store.addProduct("Beans", 15000, "low-stock");

console.log(store.listProducts());
console.log(store.getProductById(prod1.id));

store.editProduct(prod1.id, { productName: "White Rice", cost: 21000 });
store.updateStockStatus(prod2.id, "out-of-stock");

store.deleteProduct(prod1.id);

console.log(store.listProducts());
