type User = {
  username: string;
  email: string;
  password: string;
  role: string;
};

type LoginData = {
  email: string;
  password: string;
};

type UserData = {
  _id: string;
  username: string;
  email: string;
  role: string;
};

type Product = {
  _id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  specs: Record<string, string | number>;
  stock: number;
  totalSold: number;
};

type CartItem = Product & {
  quantity: number;
};

type FilterOption = {
  key: string;
  label: string;
  type: "checkbox" | "range" | "select";
  options?: string[];
};

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  onChange: (min: number, max: number) => void;
};

type Order = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  username: string;
  items: CartItem[];
  totalPrice: number;
  shippingCost: number;
  finalPrice: number;
  status: string;
  createdAt: string | Date;
  paymentType: string;
  isPaid: String;
};

type Review = {
  _id: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewUser = {
  _id: string;
  username: string;
};

type WishlistItem = {
  _id: string;
  user: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  createdAt: string;
  updatedAt: string;
};
