import { createContext, useState, useEffect } from "react";

// 1. Create the context
export const CartContext = createContext();

// 2. Create the provider
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const addToCart = (course) => {
    console.log("CartContext.addToCart", course?.id, course?.title);
    setCart((prev) => {
      if (prev.find((item) => item.id === course.id)) return prev;
      return [...prev, course];
    });
  };

  const removeFromCart = (courseId) => {
    console.log("CartContext.removeFromCart", courseId);
    setCart((prev) => prev.filter((item) => item.id !== courseId));
  };

  const buyNow = (course) => {
    console.log("CartContext.buyNow", course?.id, course?.title);
    // Replace cart with the selected course
    setCart([course]);
  };

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, buyNow }}>
      {children}
    </CartContext.Provider>
  );
}
