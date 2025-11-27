import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
export type UserRole = "customer" | "shopkeeper";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  streaks: number;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  distance: number; // km
  rating: number;
  isOpen: boolean;
  image?: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  image: string;
  unit: string;
}

export interface Price {
  id: string;
  itemId: string;
  shopId: string;
  price: number;
  updatedAt: Date;
  isOffer: boolean;
  stockStatus: "available" | "low" | "out";
}

export interface AppState {
  user: User | null;
  shops: Shop[];
  items: Item[];
  prices: Price[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  addPrice: (price: Omit<Price, "id" | "updatedAt">) => void;
  getCategories: () => string[];
  getItemsByCategory: (category: string) => Item[];
}

// Mock Data
const MOCK_SHOPS: Shop[] = [
  { id: "s1", name: "Fresh Mart", address: "12 Main St", distance: 0.5, rating: 4.5, isOpen: true },
  { id: "s2", name: "Daily Needs", address: "45 Cross Rd", distance: 1.2, rating: 4.2, isOpen: true },
  { id: "s3", name: "Super Bazaar", address: "88 Market Ln", distance: 2.5, rating: 4.8, isOpen: true },
];

// Image URLs for different categories
const categoryImages: Record<string, string> = {
  "Vegetables": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80",
  "Fruits": "https://images.unsplash.com/photo-1585518419759-13a3dbfa93d5?auto=format&fit=crop&w=100&q=80",
  "Grains": "https://images.unsplash.com/photo-1586985289688-cacba8101ec8?auto=format&fit=crop&w=100&q=80",
  "Dairy": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=100&q=80",
  "Spices": "https://images.unsplash.com/photo-1596040359004-1c1e3f0dd001?auto=format&fit=crop&w=100&q=80",
  "Clothing": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&q=80",
  "Toys": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=100&q=80",
  "Stationery": "https://images.unsplash.com/photo-1589939705882-86d282474b94?auto=format&fit=crop&w=100&q=80",
  "Electronics": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80",
  "Gadgets": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=100&q=80",
  "Books": "https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=100&q=80",
  "Sports": "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&w=100&q=80",
};

const MOCK_ITEMS: Item[] = [
  // Vegetables
  { id: "i1", name: "Tomato", category: "Vegetables", image: categoryImages["Vegetables"], unit: "kg" },
  { id: "i2", name: "Onion", category: "Vegetables", image: categoryImages["Vegetables"], unit: "kg" },
  { id: "i4", name: "Potato", category: "Vegetables", image: categoryImages["Vegetables"], unit: "kg" },
  { id: "i6", name: "Carrot", category: "Vegetables", image: categoryImages["Vegetables"], unit: "kg" },
  { id: "i7", name: "Cucumber", category: "Vegetables", image: categoryImages["Vegetables"], unit: "kg" },
  
  // Fruits
  { id: "i8", name: "Apple", category: "Fruits", image: categoryImages["Fruits"], unit: "kg" },
  { id: "i9", name: "Banana", category: "Fruits", image: categoryImages["Fruits"], unit: "kg" },
  { id: "i10", name: "Orange", category: "Fruits", image: categoryImages["Fruits"], unit: "kg" },
  { id: "i11", name: "Mango", category: "Fruits", image: categoryImages["Fruits"], unit: "kg" },
  
  // Grains
  { id: "i3", name: "Basmati Rice", category: "Grains", image: categoryImages["Grains"], unit: "kg" },
  { id: "i12", name: "Wheat Flour", category: "Grains", image: categoryImages["Grains"], unit: "kg" },
  { id: "i13", name: "Sugar", category: "Grains", image: categoryImages["Grains"], unit: "kg" },
  
  // Dairy
  { id: "i5", name: "Milk", category: "Dairy", image: categoryImages["Dairy"], unit: "L" },
  { id: "i14", name: "Yogurt", category: "Dairy", image: categoryImages["Dairy"], unit: "kg" },
  { id: "i15", name: "Cheese", category: "Dairy", image: categoryImages["Dairy"], unit: "kg" },
  
  // Spices
  { id: "i16", name: "Turmeric", category: "Spices", image: categoryImages["Spices"], unit: "kg" },
  { id: "i17", name: "Cumin", category: "Spices", image: categoryImages["Spices"], unit: "kg" },
  
  // Clothing
  { id: "i18", name: "T-Shirt", category: "Clothing", image: categoryImages["Clothing"], unit: "piece" },
  { id: "i19", name: "Jeans", category: "Clothing", image: categoryImages["Clothing"], unit: "piece" },
  { id: "i20", name: "Dress", category: "Clothing", image: categoryImages["Clothing"], unit: "piece" },
  { id: "i21", name: "Shirt", category: "Clothing", image: categoryImages["Clothing"], unit: "piece" },
  
  // Toys
  { id: "i22", name: "Action Figure", category: "Toys", image: categoryImages["Toys"], unit: "piece" },
  { id: "i23", name: "Building Blocks", category: "Toys", image: categoryImages["Toys"], unit: "set" },
  { id: "i24", name: "Puzzle", category: "Toys", image: categoryImages["Toys"], unit: "piece" },
  { id: "i25", name: "Doll", category: "Toys", image: categoryImages["Toys"], unit: "piece" },
  
  // Stationery
  { id: "i26", name: "Notebook", category: "Stationery", image: categoryImages["Stationery"], unit: "piece" },
  { id: "i27", name: "Pen Set", category: "Stationery", image: categoryImages["Stationery"], unit: "pack" },
  { id: "i28", name: "Pencil", category: "Stationery", image: categoryImages["Stationery"], unit: "pack" },
  { id: "i29", name: "Eraser", category: "Stationery", image: categoryImages["Stationery"], unit: "piece" },
  
  // Electronics
  { id: "i30", name: "LED Bulb", category: "Electronics", image: categoryImages["Electronics"], unit: "piece" },
  { id: "i31", name: "Power Strip", category: "Electronics", image: categoryImages["Electronics"], unit: "piece" },
  { id: "i32", name: "Phone Charger", category: "Electronics", image: categoryImages["Electronics"], unit: "piece" },
  
  // Gadgets
  { id: "i33", name: "Smartwatch", category: "Gadgets", image: categoryImages["Gadgets"], unit: "piece" },
  { id: "i34", name: "Wireless Earbuds", category: "Gadgets", image: categoryImages["Gadgets"], unit: "pair" },
  { id: "i35", name: "Phone Stand", category: "Gadgets", image: categoryImages["Gadgets"], unit: "piece" },
  
  // Books
  { id: "i36", name: "Fiction Novel", category: "Books", image: categoryImages["Books"], unit: "piece" },
  { id: "i37", name: "Self-Help Book", category: "Books", image: categoryImages["Books"], unit: "piece" },
  
  // Sports
  { id: "i38", name: "Sports Shoes", category: "Sports", image: categoryImages["Sports"], unit: "pair" },
  { id: "i39", name: "Yoga Mat", category: "Sports", image: categoryImages["Sports"], unit: "piece" },
];

const MOCK_PRICES: Price[] = [
  { id: "p1", itemId: "i1", shopId: "s1", price: 40, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p2", itemId: "i1", shopId: "s2", price: 38, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p3", itemId: "i1", shopId: "s3", price: 45, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p4", itemId: "i2", shopId: "s1", price: 30, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p5", itemId: "i3", shopId: "s2", price: 120, updatedAt: new Date(), isOffer: true, stockStatus: "low" },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [shops] = useState<Shop[]>(MOCK_SHOPS);
  const [items] = useState<Item[]>(MOCK_ITEMS);
  const [prices, setPrices] = useState<Price[]>(MOCK_PRICES);
  const { toast } = useToast();

  const login = (email: string, role: UserRole) => {
    setUser({
      id: "u1",
      name: email.split("@")[0],
      email,
      role,
      points: 150,
      streaks: 5,
    });
    toast({
      title: `Welcome back, ${role === "shopkeeper" ? "Shopkeeper" : "Customer"}!`,
      description: "Successfully logged in.",
    });
  };

  const logout = () => {
    setUser(null);
    toast({ title: "Logged out" });
  };

  const addPrice = (newPrice: Omit<Price, "id" | "updatedAt">) => {
    const price: Price = {
      ...newPrice,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date(),
    };
    setPrices((prev) => [...prev, price]);
    toast({ title: "Price Updated", description: "Your price has been listed." });
  };

  const getCategories = () => {
    return Array.from(new Set(items.map(item => item.category))).sort();
  };

  const getItemsByCategory = (category: string) => {
    return items.filter(item => item.category === category);
  };

  return (
    <AppContext.Provider value={{ user, shops, items, prices, login, logout, addPrice, getCategories, getItemsByCategory }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
