import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/products";

export default function ProductEditPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = adding new, set = editing existing

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", image: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || ""
    });
    setEditingId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: editingId })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Update failed");
          return res.json();
        })
        .then(() => {
          alert("Product updated successfully!");
          fetchProducts();
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          alert("Could not update product. Is json-server running?");
        });
    } else {
      // CREATE new product
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: Date.now().toString()
        })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Create failed");
          return res.json();
        })
        .then(() => {
          alert("Product added successfully!");
          fetchProducts();
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          alert("Could not add product. Is json-server running?");
        });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        return res.json();
      })
      .then(() => {
        alert("Product deleted successfully!");
        fetchProducts();
      })
      .catch((err) => {
        console.error(err);
        alert("Could not delete product.");
      });
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-edit-page">
      <h1>Manage Products</h1>

      <button onClick={handleAddNew} className="add-btn">
         Add New Product
      </button>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            value={formData.price}
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Product Image URL"
            value={formData.image}
            onChange={handleFormChange}
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleFormChange}
          />
          <div className="form-buttons">
            <button type="submit">
              {editingId ? "Save Changes" : "Add Product"}
            </button>
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Product List */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.name}</h2>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>

              {/* Admin-only buttons */}
              <div className="admin-buttons">
                <button onClick={() => handleEdit(product)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
}