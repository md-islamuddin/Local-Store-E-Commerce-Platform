import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { handleApiError } from "../utils/errorHandler";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const handleAddToCart = (prod) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = cart.findIndex((i) => i._id === prod._id);
    if (idx !== -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ ...prod, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${prod.name} added to cart!`);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data.data || []);
        setError(null);
      })
      .catch((err) => {
        const errorMessage = handleApiError(err, "fetching products");
        setError(errorMessage);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((prod) => (
          <ProductCard key={prod._id} product={prod} onAdd={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
