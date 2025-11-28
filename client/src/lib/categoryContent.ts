// Unique and interactive content for each category
export interface CategoryContent {
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  features: string[];
  bestDeals: string;
  savingTip: string;
  trending: string;
  emojis: string;
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  "Vegetables": {
    name: "Fresh Farm to Table",
    description: "Handpicked fresh vegetables daily from local farms",
    icon: "🥬",
    bgColor: "#228B22",
    features: ["Farm Fresh", "Pesticide-Free", "Same Day Delivery", "Organic Options"],
    bestDeals: "Get 20% off on bulk purchases of seasonal vegetables",
    savingTip: "Buy in bulk on Mondays for the best prices and freshness",
    trending: "Trending: Organic leafy greens and exotic salad vegetables",
    emojis: "🥕🥦🌽🥒🧅"
  },
  "Fruits": {
    name: "Nature's Candies",
    description: "Imported and domestic fruits with guaranteed freshness",
    icon: "🍎",
    bgColor: "#FF6347",
    features: ["Premium Quality", "Imported Varieties", "Ripeness Guarantee", "Allergy Info"],
    bestDeals: "Buy 2 kg get 1 kg free on selected fruits every weekend",
    savingTip: "Subscribe to weekly fruit boxes and save up to 30%",
    trending: "Trending: Dragon fruit, pomegranate, and exotic berries",
    emojis: "🍌🍊🍇🥝🍓"
  },
  "Grains": {
    name: "Staple Store",
    description: "Premium quality grains and cereals for your kitchen",
    icon: "🌾",
    bgColor: "#D2691E",
    features: ["100% Pure", "Non-GMO", "Bulk Discounts", "Storage Tips Included"],
    bestDeals: "Rice & flour combo pack: Save ₹100+ per month",
    savingTip: "Buy larger quantities - bigger packs cost less per kg",
    trending: "Trending: Organic quinoa, millets, and ancient grains",
    emojis: "🍚🌽🥔🫘🌻"
  },
  "Dairy": {
    name: "Milk & Cheese Paradise",
    description: "Fresh dairy products from certified farms",
    icon: "🥛",
    bgColor: "#87CEEB",
    features: ["Cold Chain Maintained", "Farm Direct", "Calcium Rich", "No Additives"],
    bestDeals: "Milk subscription: Get ₹5 off per liter, free delivery",
    savingTip: "Morning milk orders have special discounts on all products",
    trending: "Trending: Greek yogurt, imported cheese, and paneer",
    emojis: "🧈🧀🥛🍶🧂"
  },
  "Spices": {
    name: "Aromatic Collection",
    description: "Authentic spices that bring flavor to your meals",
    icon: "🌶️",
    bgColor: "#A0522D",
    features: ["Hand-Sorted", "No Adulterants", "Airtight Packing", "Recipe Cards"],
    bestDeals: "Spice combo packs with 5-6 essential spices at 25% off",
    savingTip: "Buy whole spices and grind at home for maximum freshness",
    trending: "Trending: Himalayan pink salt, saffron, and kasuri methi",
    emojis: "🌶️🧄🧅⚫🟡"
  },
  "Clothing": {
    name: "Style & Comfort Hub",
    description: "Latest fashion trends with premium quality fabrics",
    icon: "👕",
    bgColor: "#4169E1",
    features: ["Designer Brands", "Size Guide", "Easy Returns", "Seasonal Collections"],
    bestDeals: "Seasonal sale: Up to 50% off on new arrivals",
    savingTip: "Mix & match: Buy 3 items get 10% additional discount",
    trending: "Trending: Oversized fits, ethnic wear, and sustainable fashion",
    emojis: "👔👗👖🧥👠"
  },
  "Toys": {
    name: "Fun & Learning Zone",
    description: "Educational and entertaining toys for all ages",
    icon: "🎮",
    bgColor: "#FFB6C1",
    features: ["Age-Appropriate", "Safety Certified", "Educational Value", "Gift Wrapping"],
    bestDeals: "Birthday month special: 20% off on toy purchases",
    savingTip: "Combo sets offer better value than buying individually",
    trending: "Trending: STEM kits, board games, and building sets",
    emojis: "🎯🎲🎪🧩🪀"
  },
  "Stationery": {
    name: "Creative Workspace",
    description: "Premium stationery for students and professionals",
    icon: "📝",
    bgColor: "#FFD700",
    features: ["Eco-Friendly", "Premium Quality", "Bulk Options", "Corporate Gifting"],
    bestDeals: "Back to school: Stationery bundle packs at 30% discount",
    savingTip: "Subscribe to monthly stationery boxes for regular savings",
    trending: "Trending: Eco-friendly notebooks, premium pens, and planners",
    emojis: "✏️📓📍✂️🖍️"
  },
  "Electronics": {
    name: "Tech Store",
    description: "Latest electronics with warranty and support",
    icon: "⚡",
    bgColor: "#696969",
    features: ["Manufacturer Warranty", "Expert Support", "Easy EMI", "Verified Sellers"],
    bestDeals: "Exchange offer: Trade in your old electronics for credits",
    savingTip: "Buy during flash sales for up to 40% discount",
    trending: "Trending: Smart home devices, portable chargers, and lighting",
    emojis: "💡🔌🔋💻📱"
  },
  "Gadgets": {
    name: "Innovation Center",
    description: "Cutting-edge gadgets for tech enthusiasts",
    icon: "📱",
    bgColor: "#32CD32",
    features: ["Latest Technology", "Extended Warranty", "Trade-In Options", "Demo Available"],
    bestDeals: "Bundle combo: Buy phone + accessories, save ₹2000+",
    savingTip: "Pre-order new launches and get early bird discounts",
    trending: "Trending: Wireless earbuds, smartwatches, and power banks",
    emojis: "⌚🎧🖥️⌨️🖱️"
  },
  "Books": {
    name: "Literary Paradise",
    description: "Diverse collection of books across genres",
    icon: "📚",
    bgColor: "#8B4513",
    features: ["Multiple Genres", "E-Books Available", "Author Signed Copies", "Book Club Discounts"],
    bestDeals: "Buy 2 books, get 1 book 50% off on new releases",
    savingTip: "Join book club and get monthly subscription at ₹99",
    trending: "Trending: Self-help, fiction bestsellers, and biographies",
    emojis: "📖📕📗📘📙"
  },
  "Sports": {
    name: "Active Living Store",
    description: "Sports equipment for all fitness levels",
    icon: "⚽",
    bgColor: "#FF8C00",
    features: ["Professional Grade", "Beginner Friendly", "Expert Advice", "Free Training Videos"],
    bestDeals: "Fitness challenge: Buy gym equipment, get free 1-month training",
    savingTip: "Seasonal sale: Winter/summer sports gear at 35% off",
    trending: "Trending: Yoga, home gym, and outdoor adventure gear",
    emojis: "🏃🧘🏋️🚴⛹️"
  }
};

// Interactive engagement content
export const INTERACTIVE_FEATURES: Record<string, { quickTips: string[]; healthBenefit: string; recipe: string }> = {
  "Vegetables": {
    quickTips: [
      "Storage: Keep in refrigerator to extend freshness",
      "Washing: Rinse before cooking to remove dirt",
      "Selection: Choose firm vegetables with no spots",
      "Seasonal: Buy what's in season for best prices"
    ],
    healthBenefit: "Rich in vitamins, minerals, and fiber",
    recipe: "Try a colorful salad or fresh vegetable curry"
  },
  "Fruits": {
    quickTips: [
      "Ripeness: Check by gentle squeeze",
      "Storage: Store separately from vegetables",
      "Washing: Rinse under running water",
      "Peak season: Maximum nutrition and taste"
    ],
    healthBenefit: "Packed with natural sugars and antioxidants",
    recipe: "Make fresh fruit smoothies or fruit salads"
  },
  "Grains": {
    quickTips: [
      "Storage: Keep in airtight containers",
      "Check date: Always verify expiry date",
      "Measuring: Use proper measuring cups",
      "Cooking: Follow instructions for best results"
    ],
    healthBenefit: "Excellent source of carbohydrates and energy",
    recipe: "Cook perfect basmati rice or whole wheat rotis"
  },
  "Dairy": {
    quickTips: [
      "Cold chain: Store immediately after delivery",
      "Expiry: Check date before every use",
      "Hygiene: Use clean utensils",
      "Quantity: Buy what you'll consume in time"
    ],
    healthBenefit: "Great source of calcium and protein",
    recipe: "Make homemade paneer or fresh curd"
  },
  "Spices": {
    quickTips: [
      "Storage: Keep in cool, dry place",
      "Airtight: Use sealed containers",
      "Freshness: Smell should be strong",
      "Quantity: Buy smaller amounts for variety"
    ],
    healthBenefit: "Anti-inflammatory and immune-boosting properties",
    recipe: "Prepare traditional spice masalas"
  },
  "Clothing": {
    quickTips: [
      "Washing: Check care labels before washing",
      "Color: Separate light and dark colors",
      "Drying: Air dry or follow label instructions",
      "Storage: Fold neatly to prevent wrinkles"
    ],
    healthBenefit: "Comfortable fabrics for all-day wear",
    recipe: "Style multiple looks from single wardrobe"
  },
  "Toys": {
    quickTips: [
      "Age check: Buy age-appropriate toys",
      "Safety: Verify certifications",
      "Cleanliness: Wash toys regularly",
      "Storage: Organize in designated bins"
    ],
    healthBenefit: "Promotes learning and development",
    recipe: "Create play zones for different age groups"
  },
  "Stationery": {
    quickTips: [
      "Organization: Use desk organizers",
      "Maintenance: Keep pens capped",
      "Storage: Store away from heat",
      "Inventory: Keep backup supplies"
    ],
    healthBenefit: "Creative outlet for learning and work",
    recipe: "Set up productive study or work space"
  },
  "Electronics": {
    quickTips: [
      "Safety: Use quality surge protectors",
      "Heat: Keep devices in cool environments",
      "Cleaning: Use dry cloths only",
      "Usage: Follow manufacturer guidelines"
    ],
    healthBenefit: "Improves productivity and connectivity",
    recipe: "Create smart home setup"
  },
  "Gadgets": {
    quickTips: [
      "Battery: Charge fully before first use",
      "Updates: Keep software updated",
      "Protection: Use cases and screen protectors",
      "Backup: Regular data backup essential"
    ],
    healthBenefit: "Enhances digital lifestyle",
    recipe: "Build complete tech ecosystem"
  },
  "Books": {
    quickTips: [
      "Storage: Keep away from direct sunlight",
      "Handling: Use bookmarks, not page folding",
      "Reading: Join reading communities",
      "Genre: Explore new genres regularly"
    ],
    healthBenefit: "Boosts knowledge and reduces stress",
    recipe: "Create cozy reading nook"
  },
  "Sports": {
    quickTips: [
      "Maintenance: Clean gear after use",
      "Fitting: Get proper size for equipment",
      "Safety: Use protective gear always",
      "Training: Learn correct techniques first"
    ],
    healthBenefit: "Builds strength, endurance, and mental health",
    recipe: "Start fitness routine with right equipment"
  }
};
