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

export interface CartItem {
  itemId: string;
  quantity: number;
  addedAt: Date;
}

export interface AppState {
  user: User | null;
  shops: Shop[];
  items: Item[];
  prices: Price[];
  cart: CartItem[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  addPrice: (price: Omit<Price, "id" | "updatedAt">) => void;
  getCategories: () => string[];
  getItemsByCategory: (category: string) => Item[];
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

// Mock Data
const MOCK_SHOPS: Shop[] = [
  { id: "s1", name: "Fresh Mart", address: "12 Main St", distance: 0.5, rating: 4.5, isOpen: true },
  { id: "s2", name: "Daily Needs", address: "45 Cross Rd", distance: 1.2, rating: 4.2, isOpen: true },
  { id: "s3", name: "Super Bazaar", address: "88 Market Ln", distance: 2.5, rating: 4.8, isOpen: true },
];

// Helper function to create unique item images
const createItemImage = (itemName: string, bgColor: string) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='${bgColor}' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='white' font-weight='bold' text-anchor='middle'%3E${encodeURIComponent(itemName)}%3C/text%3E%3C/svg%3E`;
};

// Image URLs for different categories
const categoryImages: Record<string, string> = {
  "Vegetables": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23228B22' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EVegetables%3C/text%3E%3C/svg%3E",
  "Fruits": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23FF6347' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EFruits%3C/text%3E%3C/svg%3E",
  "Grains": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23D2691E' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EGrains%3C/text%3E%3C/svg%3E",
  "Dairy": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2387CEEB' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EDairy%3C/text%3E%3C/svg%3E",
  "Spices": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23A0522D' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3ESpices%3C/text%3E%3C/svg%3E",
  "Clothing": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%234169E1' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white' font-weight='bold'%3EClothing%3C/text%3E%3C/svg%3E",
  "Toys": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23FFB6C1' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EToys%3C/text%3E%3C/svg%3E",
  "Stationery": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23FFD700' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='black' font-weight='bold'%3EStationery%3C/text%3E%3C/svg%3E",
  "Electronics": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23696969' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white' font-weight='bold'%3EElectronics%3C/text%3E%3C/svg%3E",
  "Gadgets": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2332CD32' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EGadgets%3C/text%3E%3C/svg%3E",
  "Books": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%238B4513' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3EBooks%3C/text%3E%3C/svg%3E",
  "Sports": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23FF8C00' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='white' font-weight='bold'%3ESports%3C/text%3E%3C/svg%3E",
};

const MOCK_ITEMS: Item[] = [
  // Vegetables
  { id: "i1", name: "Tomato", category: "Vegetables", image: createItemImage("Tomato", "%23FF4444"), unit: "kg" },
  { id: "i2", name: "Onion", category: "Vegetables", image: createItemImage("Onion", "%23FFB347"), unit: "kg" },
  { id: "i4", name: "Potato", category: "Vegetables", image: createItemImage("Potato", "%23CD853F"), unit: "kg" },
  { id: "i6", name: "Carrot", category: "Vegetables", image: createItemImage("Carrot", "%23FF7F50"), unit: "kg" },
  { id: "i7", name: "Cucumber", category: "Vegetables", image: createItemImage("Cucumber", "%2390EE90"), unit: "kg" },
  { id: "i40", name: "Cabbage", category: "Vegetables", image: createItemImage("Cabbage", "%23228B22"), unit: "kg" },
  { id: "i41", name: "Broccoli", category: "Vegetables", image: createItemImage("Broccoli", "%23006400"), unit: "kg" },
  
  // Fruits
  { id: "i8", name: "Apple", category: "Fruits", image: createItemImage("Apple", "%23DC143C"), unit: "kg" },
  { id: "i9", name: "Banana", category: "Fruits", image: createItemImage("Banana", "%23FFD700"), unit: "kg" },
  { id: "i10", name: "Orange", category: "Fruits", image: createItemImage("Orange", "%23FF8C00"), unit: "kg" },
  { id: "i11", name: "Mango", category: "Fruits", image: createItemImage("Mango", "%23FF6347"), unit: "kg" },
  { id: "i42", name: "Grapes", category: "Fruits", image: createItemImage("Grapes", "%239932CC"), unit: "kg" },
  { id: "i43", name: "Watermelon", category: "Fruits", image: createItemImage("Watermelon", "%23FF1493"), unit: "piece" },
  
  // Grains
  { id: "i3", name: "Basmati Rice", category: "Grains", image: createItemImage("Basmati Rice", "%23DEB887"), unit: "kg" },
  { id: "i12", name: "Wheat Flour", category: "Grains", image: createItemImage("Wheat Flour", "%23F5DEB3"), unit: "kg" },
  { id: "i13", name: "Sugar", category: "Grains", image: createItemImage("Sugar", "%23FFFACD"), unit: "kg" },
  { id: "i44", name: "Daal", category: "Grains", image: createItemImage("Daal", "%23FF8C69"), unit: "kg" },
  { id: "i45", name: "Quinoa", category: "Grains", image: createItemImage("Quinoa", "%23D2B48C"), unit: "kg" },
  
  // Dairy
  { id: "i5", name: "Milk", category: "Dairy", image: createItemImage("Milk", "%23F0F8FF"), unit: "L" },
  { id: "i14", name: "Yogurt", category: "Dairy", image: createItemImage("Yogurt", "%23E0FFFF"), unit: "kg" },
  { id: "i15", name: "Cheese", category: "Dairy", image: createItemImage("Cheese", "%23FFFFE0"), unit: "kg" },
  { id: "i46", name: "Butter", category: "Dairy", image: createItemImage("Butter", "%23FFDAB9"), unit: "kg" },
  { id: "i47", name: "Paneer", category: "Dairy", image: createItemImage("Paneer", "%23F5F5DC"), unit: "kg" },
  
  // Spices
  { id: "i16", name: "Turmeric", category: "Spices", image: createItemImage("Turmeric", "%23FFB347"), unit: "kg" },
  { id: "i17", name: "Cumin", category: "Spices", image: createItemImage("Cumin", "%238B4513"), unit: "kg" },
  { id: "i48", name: "Coriander", category: "Spices", image: createItemImage("Coriander", "%23A0522D"), unit: "kg" },
  { id: "i49", name: "Black Pepper", category: "Spices", image: createItemImage("Black Pepper", "%23000000"), unit: "kg" },
  { id: "i50", name: "Cinnamon", category: "Spices", image: createItemImage("Cinnamon", "%238B5A3C"), unit: "kg" },
  
  // Clothing
  { id: "i18", name: "T-Shirt", category: "Clothing", image: createItemImage("T-Shirt", "%234169E1"), unit: "piece" },
  { id: "i19", name: "Jeans", category: "Clothing", image: createItemImage("Jeans", "%23191970"), unit: "piece" },
  { id: "i20", name: "Dress", category: "Clothing", image: createItemImage("Dress", "%23FF69B4"), unit: "piece" },
  { id: "i21", name: "Shirt", category: "Clothing", image: createItemImage("Shirt", "%23FFB6C1"), unit: "piece" },
  { id: "i51", name: "Jacket", category: "Clothing", image: createItemImage("Jacket", "%23556B2F"), unit: "piece" },
  { id: "i52", name: "Shorts", category: "Clothing", image: createItemImage("Shorts", "%2387CEEB"), unit: "piece" },
  
  // Toys
  { id: "i22", name: "Action Figure", category: "Toys", image: createItemImage("Action Figure", "%23FF6347"), unit: "piece" },
  { id: "i23", name: "Building Blocks", category: "Toys", image: createItemImage("Building Blocks", "%234169E1"), unit: "set" },
  { id: "i24", name: "Puzzle", category: "Toys", image: createItemImage("Puzzle", "%23FFD700"), unit: "piece" },
  { id: "i25", name: "Doll", category: "Toys", image: createItemImage("Doll", "%23FFB6C1"), unit: "piece" },
  { id: "i53", name: "Remote Car", category: "Toys", image: createItemImage("Remote Car", "%23FF8C00"), unit: "piece" },
  { id: "i54", name: "Board Game", category: "Toys", image: createItemImage("Board Game", "%239932CC"), unit: "piece" },
  
  // Stationery
  { id: "i26", name: "Notebook", category: "Stationery", image: createItemImage("Notebook", "%23FF6B6B"), unit: "piece" },
  { id: "i27", name: "Pen Set", category: "Stationery", image: createItemImage("Pen Set", "%234ECDC4"), unit: "pack" },
  { id: "i28", name: "Pencil", category: "Stationery", image: createItemImage("Pencil", "%23FFE66D"), unit: "pack" },
  { id: "i29", name: "Eraser", category: "Stationery", image: createItemImage("Eraser", "%23FF6B9D"), unit: "piece" },
  { id: "i55", name: "Markers", category: "Stationery", image: createItemImage("Markers", "%2395E1D3"), unit: "set" },
  { id: "i56", name: "Highlighter", category: "Stationery", image: createItemImage("Highlighter", "%23F38181"), unit: "pack" },
  
  // Electronics
  { id: "i30", name: "LED Bulb", category: "Electronics", image: createItemImage("LED Bulb", "%23FFD700"), unit: "piece" },
  { id: "i31", name: "Power Strip", category: "Electronics", image: createItemImage("Power Strip", "%23696969"), unit: "piece" },
  { id: "i32", name: "Phone Charger", category: "Electronics", image: createItemImage("Phone Charger", "%23000000"), unit: "piece" },
  { id: "i57", name: "USB Cable", category: "Electronics", image: createItemImage("USB Cable", "%23A9A9A9"), unit: "piece" },
  { id: "i58", name: "Screen Protector", category: "Electronics", image: createItemImage("Screen Protector", "%23778899"), unit: "pack" },
  
  // Gadgets
  { id: "i33", name: "Smartwatch", category: "Gadgets", image: createItemImage("Smartwatch", "%23FF6B6B"), unit: "piece" },
  { id: "i34", name: "Wireless Earbuds", category: "Gadgets", image: createItemImage("Wireless Earbuds", "%234ECDC4"), unit: "pair" },
  { id: "i35", name: "Phone Stand", category: "Gadgets", image: createItemImage("Phone Stand", "%23FFE66D"), unit: "piece" },
  { id: "i59", name: "Power Bank", category: "Gadgets", image: createItemImage("Power Bank", "%23FF6B9D"), unit: "piece" },
  { id: "i60", name: "Phone Case", category: "Gadgets", image: createItemImage("Phone Case", "%2395E1D3"), unit: "piece" },
  
  // Books
  { id: "i36", name: "Fiction Novel", category: "Books", image: createItemImage("Fiction Novel", "%238B4513"), unit: "piece" },
  { id: "i37", name: "Self-Help Book", category: "Books", image: createItemImage("Self-Help Book", "%23DC143C"), unit: "piece" },
  { id: "i61", name: "Adventure Novel", category: "Books", image: createItemImage("Adventure Novel", "%234169E1"), unit: "piece" },
  { id: "i62", name: "Romance Novel", category: "Books", image: createItemImage("Romance Novel", "%23FF69B4"), unit: "piece" },
  { id: "i63", name: "Biography", category: "Books", image: createItemImage("Biography", "%23DAA520"), unit: "piece" },
  { id: "i64", name: "Science Book", category: "Books", image: createItemImage("Science Book", "%2320B2AA"), unit: "piece" },
  
  // Sports
  { id: "i38", name: "Sports Shoes", category: "Sports", image: createItemImage("Sports Shoes", "%23FF6B6B"), unit: "pair" },
  { id: "i39", name: "Yoga Mat", category: "Sports", image: createItemImage("Yoga Mat", "%2395E1D3"), unit: "piece" },
  { id: "i65", name: "Dumbbells", category: "Sports", image: createItemImage("Dumbbells", "%23333333"), unit: "kg" },
  { id: "i66", name: "Cricket Bat", category: "Sports", image: createItemImage("Cricket Bat", "%23CD853F"), unit: "piece" },
  { id: "i67", name: "Basketball", category: "Sports", image: createItemImage("Basketball", "%23FF8C00"), unit: "piece" },
];

const MOCK_PRICES: Price[] = [
  // Vegetables
  { id: "p1", itemId: "i1", shopId: "s1", price: 40, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p2", itemId: "i1", shopId: "s2", price: 38, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p3", itemId: "i1", shopId: "s3", price: 45, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p4", itemId: "i2", shopId: "s1", price: 30, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p5", itemId: "i3", shopId: "s2", price: 120, updatedAt: new Date(), isOffer: true, stockStatus: "low" },
  { id: "p6", itemId: "i4", shopId: "s1", price: 35, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p7", itemId: "i4", shopId: "s2", price: 33, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p8", itemId: "i6", shopId: "s3", price: 28, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p9", itemId: "i7", shopId: "s1", price: 25, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p10", itemId: "i40", shopId: "s2", price: 20, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p11", itemId: "i41", shopId: "s3", price: 45, updatedAt: new Date(), isOffer: false, stockStatus: "low" },

  // Fruits
  { id: "p12", itemId: "i8", shopId: "s1", price: 80, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p13", itemId: "i8", shopId: "s2", price: 85, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p14", itemId: "i9", shopId: "s3", price: 50, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p15", itemId: "i10", shopId: "s1", price: 70, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p16", itemId: "i11", shopId: "s2", price: 120, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p17", itemId: "i42", shopId: "s3", price: 90, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p18", itemId: "i43", shopId: "s1", price: 100, updatedAt: new Date(), isOffer: false, stockStatus: "low" },

  // Grains
  { id: "p19", itemId: "i3", shopId: "s1", price: 115, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p20", itemId: "i12", shopId: "s2", price: 180, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p21", itemId: "i13", shopId: "s3", price: 40, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p22", itemId: "i44", shopId: "s1", price: 95, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p23", itemId: "i45", shopId: "s2", price: 200, updatedAt: new Date(), isOffer: true, stockStatus: "low" },

  // Dairy
  { id: "p24", itemId: "i5", shopId: "s1", price: 55, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p25", itemId: "i14", shopId: "s2", price: 75, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p26", itemId: "i15", shopId: "s3", price: 250, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p27", itemId: "i46", shopId: "s1", price: 320, updatedAt: new Date(), isOffer: false, stockStatus: "low" },
  { id: "p28", itemId: "i47", shopId: "s2", price: 180, updatedAt: new Date(), isOffer: true, stockStatus: "available" },

  // Spices
  { id: "p29", itemId: "i16", shopId: "s1", price: 150, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p30", itemId: "i17", shopId: "s2", price: 200, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p31", itemId: "i48", shopId: "s3", price: 180, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p32", itemId: "i49", shopId: "s1", price: 220, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p33", itemId: "i50", shopId: "s2", price: 250, updatedAt: new Date(), isOffer: false, stockStatus: "low" },

  // Clothing
  { id: "p34", itemId: "i18", shopId: "s1", price: 300, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p35", itemId: "i19", shopId: "s2", price: 1200, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p36", itemId: "i20", shopId: "s3", price: 800, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p37", itemId: "i21", shopId: "s1", price: 500, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p38", itemId: "i51", shopId: "s2", price: 2000, updatedAt: new Date(), isOffer: true, stockStatus: "low" },
  { id: "p39", itemId: "i52", shopId: "s3", price: 600, updatedAt: new Date(), isOffer: false, stockStatus: "available" },

  // Toys
  { id: "p40", itemId: "i22", shopId: "s1", price: 450, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p41", itemId: "i23", shopId: "s2", price: 800, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p42", itemId: "i24", shopId: "s3", price: 350, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p43", itemId: "i25", shopId: "s1", price: 500, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p44", itemId: "i53", shopId: "s2", price: 1200, updatedAt: new Date(), isOffer: true, stockStatus: "low" },
  { id: "p45", itemId: "i54", shopId: "s3", price: 600, updatedAt: new Date(), isOffer: false, stockStatus: "available" },

  // Stationery
  { id: "p46", itemId: "i26", shopId: "s1", price: 50, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p47", itemId: "i27", shopId: "s2", price: 150, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p48", itemId: "i28", shopId: "s3", price: 80, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p49", itemId: "i29", shopId: "s1", price: 20, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p50", itemId: "i55", shopId: "s2", price: 200, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p51", itemId: "i56", shopId: "s3", price: 120, updatedAt: new Date(), isOffer: false, stockStatus: "low" },

  // Electronics
  { id: "p52", itemId: "i30", shopId: "s1", price: 80, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p53", itemId: "i31", shopId: "s2", price: 300, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p54", itemId: "i32", shopId: "s3", price: 400, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p55", itemId: "i57", shopId: "s1", price: 150, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p56", itemId: "i58", shopId: "s2", price: 200, updatedAt: new Date(), isOffer: true, stockStatus: "low" },

  // Gadgets
  { id: "p57", itemId: "i33", shopId: "s1", price: 8000, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p58", itemId: "i34", shopId: "s2", price: 3000, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p59", itemId: "i35", shopId: "s3", price: 300, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p60", itemId: "i59", shopId: "s1", price: 1500, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p61", itemId: "i60", shopId: "s2", price: 400, updatedAt: new Date(), isOffer: true, stockStatus: "available" },

  // Books
  { id: "p62", itemId: "i36", shopId: "s1", price: 250, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p63", itemId: "i37", shopId: "s2", price: 350, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p64", itemId: "i61", shopId: "s3", price: 280, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p65", itemId: "i62", shopId: "s1", price: 300, updatedAt: new Date(), isOffer: false, stockStatus: "low" },
  { id: "p66", itemId: "i63", shopId: "s2", price: 450, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p67", itemId: "i64", shopId: "s3", price: 400, updatedAt: new Date(), isOffer: false, stockStatus: "available" },

  // Sports
  { id: "p68", itemId: "i38", shopId: "s1", price: 2500, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
  { id: "p69", itemId: "i39", shopId: "s2", price: 800, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p70", itemId: "i65", shopId: "s3", price: 1200, updatedAt: new Date(), isOffer: false, stockStatus: "available" },
  { id: "p71", itemId: "i66", shopId: "s1", price: 1500, updatedAt: new Date(), isOffer: false, stockStatus: "low" },
  { id: "p72", itemId: "i67", shopId: "s2", price: 800, updatedAt: new Date(), isOffer: true, stockStatus: "available" },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [shops] = useState<Shop[]>(MOCK_SHOPS);
  const [items] = useState<Item[]>(MOCK_ITEMS);
  const [prices, setPrices] = useState<Price[]>(MOCK_PRICES);
  const [cart, setCart] = useState<CartItem[]>([]);
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

  const addToCart = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    setCart((prev) => {
      const existing = prev.find(c => c.itemId === itemId);
      if (existing) {
        return prev.map(c => 
          c.itemId === itemId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { itemId, quantity: 1, addedAt: new Date() }];
    });
    toast({ title: "Added to comparison", description: `${item.name} added` });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter(c => c.itemId !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      shops, 
      items, 
      prices, 
      cart, 
      login, 
      logout, 
      addPrice, 
      getCategories, 
      getItemsByCategory,
      addToCart,
      removeFromCart,
      clearCart
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
