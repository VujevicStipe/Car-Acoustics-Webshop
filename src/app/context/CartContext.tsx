"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cartItems: CartItem[];
  totalPrice: number;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  addItem: (item: CartItem) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadFromStorage = () => {
    const data = localStorage.getItem("order");
    if (data) {
      try {
        setCartItems(JSON.parse(data));
      } catch (error) {
        console.error("Greška pri parsiranju localStorage podataka", error);
      }
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "order") {
        loadFromStorage();
      }
    };

    const handleCustomSync = () => {
      loadFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCustomSync);
    };
  }, []);

  const addItem = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === newItem._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, totalPrice, updateQuantity, removeItem, addItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart mora biti unutar CartProvider");
  return context;
};
