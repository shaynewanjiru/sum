import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom";

const ProductEditPage = () =>{
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id: id,
    name: "",
    price: "",
    description: ""
  })

  

   const inputRef = useRef(null);
   useEffect(() => {
    inputRef.current.focus();
   }, []);

   useEffect(() => {
    if (id) {
      fetch(`/db.json`)
        .then((response) => response.json())
        .then((data) => {
          const foundProduct = data.products.find((p) => p.id === parseInt(id));
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            alert("Product not found");
            navigate("/products");
          }

  const handleChange = (event) => {
    setProduct({
      ...product,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
      alert("Product updated successfully!");
  }

  return (
    <div className="product-edit-page">
      <form>   
      <input   className="Product-Name" 
       ref={inputRef}   
       type="text" name="name" 
       placeholder="Product Name"
        value={product.name} 
        onChange={handleChange} />

      <input ref={inputRef} 
       className="ProductPrice"  
        type="text" name="price"
         placeholder="Product Price"
          value={product.price}
           onChange={handleChange} />

           <input ref={inputRef}
            className="ProductImage" 
             type="image" name="image"
              placeholder="Product Image URL"
               value={product.image}
                onChange={handleChange} />

      <textarea className="description" 
      name="description"
       placeholder="Product Description"
        value={product.description} 
        onChange={handleChange} />

      <button onClick={handleSubmit} >Save Changes</button>
      </form>

    </div>
  );
}
export default ProductEditPage