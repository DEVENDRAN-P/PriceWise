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
}

// Mock Data
const MOCK_SHOPS: Shop[] = [
  { id: "s1", name: "Fresh Mart", address: "12 Main St", distance: 0.5, rating: 4.5, isOpen: true },
  { id: "s2", name: "Daily Needs", address: "45 Cross Rd", distance: 1.2, rating: 4.2, isOpen: true },
  { id: "s3", name: "Super Bazaar", address: "88 Market Ln", distance: 2.5, rating: 4.8, isOpen: true },
];

import vegImg from "@assets/generated_images/fresh_vegetables_basket.png";
import grainImg from "@assets/generated_images/grocery_staples.png";

const MOCK_ITEMS: Item[] = [
  { id: "i1", name: "Tomato", category: "Vegetables", image: vegImg, unit: "kg" },
  { id: "i2", name: "Onion", category: "Vegetables", image: vegImg, unit: "kg" },
  { id: "i3", name: "Basmati Rice", category: "Grains", image: grainImg, unit: "kg" },
  { id: "i4", name: "Potato", category: "Vegetables", image: vegImg, unit: "kg" },
  { id: "i5", name: "Milk", category: "Dairy", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=100&q=80", unit: "L" },
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

  return (
    <AppContext.Provider value={{ user, shops, items, prices, login, logout, addPrice }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
