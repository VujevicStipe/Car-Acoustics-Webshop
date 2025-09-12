export const addToCart = (product: Product): { addedNew: boolean } => {
  const cartStr = localStorage.getItem("order");
  const cart: CartItem[] = cartStr ? JSON.parse(cartStr) : [];

  const existingItem = cart.find((item) => item._id === product._id);

  if (existingItem) {
    return { addedNew: false };
  } else {
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem("order", JSON.stringify(cart));
    dispatchCartUpdated();
    return { addedNew: true };
  }
};

export default function dispatchCartUpdated() {
  const cartStr = localStorage.getItem("order");
  const count = cartStr ? JSON.parse(cartStr).length : 0;
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: count }));
}

export const removeFromCart = (productId: string) => {
  const cartStr = localStorage.getItem("order");
  let cart: CartItem[] = cartStr ? JSON.parse(cartStr) : [];

  cart = cart.filter((item) => item._id !== productId);
  localStorage.setItem("order", JSON.stringify(cart));

  dispatchCartUpdated();
};
