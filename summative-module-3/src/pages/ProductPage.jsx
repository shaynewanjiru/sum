import { useState, useEffect } from 'react';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setProducts(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-page">
      <h1>Our Products</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

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
            </div>
          ))
        ) : (
          
          <p>No products found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
}