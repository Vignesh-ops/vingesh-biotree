import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart data on mount
  const fetchCartData = async () => {
    try {
      const response = await api.get("/cart");
      setCartItems(response.data);
    } catch (err) {
      console.error("Failed to fetch cart data:", err);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const addToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      try {
        await api.put(`/cart/${product.id}`, {
          ...product,
          quantity: existingItem.quantity + 1,
        });
      } catch (err) {
        console.error("Unable to update item:", err);
      }
    } else {
      try {
        await api.post("/cart", { ...product, quantity: 1 });
      } catch (err) {
        console.error("Unable to add new item:", err);
      }
    }

    fetchCartData();
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCartData();
    } catch (err) {
      console.error("Unable to remove item:", err);
    }
  };

  const decreaseQuantity = async (item) =>{

    try {
      await api.put(`/cart/${item.id}`, {
        ...item,
        quantity: item.quantity - 1,
      });
      fetchCartData()
    } catch (err) {
      console.error("Unable to update item:", err);
    }

  }

  const increaseQuantity = async (item) =>{

    try {
      await api.put(`/cart/${item.id}`, {
        ...item,
        quantity: item.quantity + 1,
      });
      fetchCartData()
    } catch (err) {
      console.error("Unable to update item:", err);
    }

  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,decreaseQuantity,increaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
