import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  
  const [product, setProduct] = useState({
    id: id || "", 
    name: "",
    price: "",
    description: "",
    image: ""
  });
  
  
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

 
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
    
    
    fetch(`http://localhost:3001/products/${id}`, {
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
      <h1>Edit Product #{id}</h1>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="Product-Name"
          type="text"
          name="name"
          placeholder="New Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <input
          className="ProductPrice"
          type="number"
          name="price"
          placeholder="New Product Price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <input
          className="ProductImage"
          type="text"
          name="image"
          placeholder="New Product Image URL"
          value={product.image}
          onChange={handleChange}
        />

        <textarea
          className="description"
          name="description"
          placeholder="New Product Description"
          value={product.description}
          onChange={handleChange}
        />

        <button type="submit">Overwrite Changes</button>
      </form>
    </div>
  );
};

export default ProductEditPage;