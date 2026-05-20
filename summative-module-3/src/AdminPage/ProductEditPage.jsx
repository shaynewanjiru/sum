import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    image: ""
  });
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading product:", err);
          alert("Product not found");
          navigate("/admin"); 
        });
    }
  }, [id, navigate]);

 useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleChange = (event) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    
    fetch(`http://localhost:3000/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product)
    })
    .then((res) => {
      if (!res.ok) throw new Error("Server failed to update");
      return res.json();
    })
    .then(() => {
      alert("Product updated successfully!");
      navigate("/products"); 
    })
    .catch((err) => {
      console.error("Error saving updates:", err);
      alert("Could not save changes. Is json-server running?");
    });
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div className="product-edit-page">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="Product-Name"
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <input
          className="ProductPrice"
          type="number"
          name="price"
          placeholder="Product Price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <input
          className="ProductImage"
          type="text"
          name="image"
          placeholder="Product Image URL"
          value={product.image}
          onChange={handleChange}
        />

        <textarea
          className="description"
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProductEditPage;
