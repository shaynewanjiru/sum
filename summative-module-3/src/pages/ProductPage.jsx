import { useState, useEffect } from 'react';

export default function ProductPage() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch("/db.json")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data.products || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });

    }, []);

    
 






if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-page">
      <h1>Our Products</h1>
        <div className="product-list">
            {products.map((product) => (
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
            ))}
        </div>
    </div>
  );
}