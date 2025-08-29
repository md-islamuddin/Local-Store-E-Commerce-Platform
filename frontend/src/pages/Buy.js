import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleStorageError, validateRequired, validateMinLength } from "../utils/errorHandler";

export default function Buy() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedOrder = JSON.parse(localStorage.getItem("order"));
      if (savedOrder) {
        setOrderStatus(savedOrder.status || "Ready to Place");
      } else {
        setError("No order found. Please add items to cart first.");
        navigate("/cart");
      }
    } catch (err) {
      const errorMessage = handleStorageError(err, "loading order details");
      setError(errorMessage);
    }
  }, [navigate]);

  const handleNext = () => {
    setError("");

    if (step === 1) {
      if (!validateRequired(address)) {
        setError("Please enter a delivery address.");
        return;
      }
      
      // Validate address format (basic validation)
      if (!validateMinLength(address.trim(), 10)) {
        setError("Please provide a complete address with sufficient details (minimum 10 characters).");
        return;
      }
    }

    if (step === 2) {
      try {
        const order = JSON.parse(localStorage.getItem("order"));
        if (order) {
          order.status = "On the Way";
          order.address = address;
          localStorage.setItem("order", JSON.stringify(order));
          localStorage.removeItem("cart");
          setOrderStatus(order.status);
        } else {
          setError("Order not found. Please start over.");
          return;
        }
      } catch (err) {
        const errorMessage = handleStorageError(err, "processing order");
        setError(errorMessage);
        return;
      }
    }

    setStep(step + 1);
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {step === 1 && (
        <>
          <label className="block font-semibold mb-2">Shipping Address:</label>
          <textarea
            rows="4"
            className="w-full border p-2 rounded mb-4"
            value={address}
            placeholder="Flat / House No. · Street · City · Pincode"
            onChange={(e) => {
              setAddress(e.target.value);
              setError(""); // Clear error when user starts typing
            }}
            required
          />
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Continue →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div className="p-4 border rounded bg-gray-50 mb-4">
            <p className="font-medium">✅ Cash on Delivery</p>
            <small className="text-gray-500">
              You'll pay when the package arrives.
            </small>
          </div>
          <button
            onClick={handleNext}
            className="bg-green-600 text-white mt-6 px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Place Order
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="bg-green-50 p-4 rounded mb-6">
            <p className="text-green-800 font-medium">
              ✅ Order placed successfully!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Your order is now being processed.
            </p>
          </div>
          <ul className="space-y-2 ml-4 list-decimal">
            <li className={`font-bold ${orderStatus !== "Ready to Place" ? "text-green-700" : "text-yellow-700"}`}>
              Ready to Place {orderStatus !== "Ready to Place" && "✔️"}
            </li>
            <li className={`font-bold ${orderStatus === "On the Way" || orderStatus === "Delivered" ? "text-green-700" : "text-gray-500"}`}>
              On the Way {orderStatus === "On the Way" && "🚚"}
            </li>
            <li className={`font-bold ${orderStatus === "Delivered" ? "text-green-700" : "text-gray-500"}`}>
              Delivered {orderStatus === "Delivered" && "📦"}
            </li>
          </ul>

          <button
            onClick={handleReturnHome}
            className="bg-blue-600 text-white mt-6 px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
        </>
      )}
    </div>
  );
}
