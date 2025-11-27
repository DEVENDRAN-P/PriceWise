import { useApp } from "@/lib/store";
import { useLocation } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Award, Lightbulb, TrendingUp, Zap, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_CONTENT, INTERACTIVE_FEATURES } from "@/lib/categoryContent";

export default function CategoryPage() {
  const { getItemsByCategory, getCategories, addToCart, prices, shops } = useApp();
  const [location, setLocation] = useLocation();
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeTab, setActiveTab] = useState("tips");
  const [transitionKey, setTransitionKey] = useState(0);

  // Extract category from location string
  const extractCategoryFromLocation = useCallback((loc: string) => {
    let extractedCat = "";
    
    if (loc.includes("?cat=")) {
      const queryPart = loc.split("?cat=")[1];
      if (queryPart) {
        extractedCat = queryPart.split("&")[0];
        try {
          extractedCat = decodeURIComponent(extractedCat);
        } catch (e) {
          console.error("Error decoding category:", e);
        }
      }
    }

    // Verify the category exists
    if (extractedCat && categories.includes(extractedCat)) {
      return extractedCat;
    } else if (categories.length > 0) {
      return categories[0];
    }
    
    return "";
  }, [categories]);

  // Track location changes from wouter
  useEffect(() => {
    const cat = extractCategoryFromLocation(location);
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
      setTransitionKey(prev => prev + 1);
      setActiveTab("tips");
    }
  }, [location, extractCategoryFromLocation, selectedCategory]);

  const items = getItemsByCategory(selectedCategory);
  const categoryData = CATEGORY_CONTENT[selectedCategory];
  const interactiveData = INTERACTIVE_FEATURES[selectedCategory];

  // Get best deals for this category
  const bestDealsForCategory = prices
    .filter(p => items.find(i => i.id === p.itemId))
    .filter(p => p.isOffer)
    .slice(0, 2);

  const handleCategoryChange = (cat: string) => {
    if (cat !== selectedCategory) {
      setSelectedCategory(cat);
      const categoryPath = `/${cat.toLowerCase()}`;
      setLocation(categoryPath);
      setTransitionKey(prev => prev + 1);
      setActiveTab("tips");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pb-24">
      {/* Enhanced Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-100 shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="h-8 w-8">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span className="text-3xl">{categoryData?.icon}</span>
              <span className="truncate">{selectedCategory}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{categoryData?.description}</p>
          </div>
        </div>

        {/* Category Tabs - Horizontal Scroll */}
        <div className="border-t border-slate-100 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 p-3 min-w-min">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={cat === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap transition-all ${
                  cat === selectedCategory 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
        {/* Category Highlights */}
        <AnimatePresence mode="wait">
          {categoryData && (
            <motion.div 
              key={`category-${transitionKey}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Features Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 }}
              >
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Quick Features */}
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" /> Key Features
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          {categoryData.features.map((feature, idx) => (
                            <motion.span 
                              key={idx} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + idx * 0.05 }}
                              className="text-xs sm:text-sm bg-white px-3 py-2 rounded-full border-2 border-slate-200 font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
                            >
                              <Check className="w-3 h-3" /> {feature}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Best Deals */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white rounded-lg p-4 border-2 border-green-200 hover:shadow-md transition-shadow"
                        >
                          <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" /> Best Deals
                          </p>
                          <p className="text-sm sm:text-base font-bold text-green-700">{categoryData.bestDeals}</p>
                        </motion.div>

                        {/* Money Saving Tip */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="bg-white rounded-lg p-4 border-2 border-amber-200 hover:shadow-md transition-shadow"
                        >
                          <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-amber-500" /> Money Saving Tip
                          </p>
                          <p className="text-sm text-slate-700">{categoryData.savingTip}</p>
                        </motion.div>

                        {/* Trending */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:shadow-md transition-shadow md:col-span-2"
                        >
                          <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                            <Lightbulb className="w-5 h-5 text-blue-500" /> Trending Now
                          </p>
                          <p className="text-sm text-slate-700">{categoryData.trending}</p>
                        </motion.div>
                      </div>

                      {/* Emojis */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-center text-3xl sm:text-4xl py-2"
                      >
                        {categoryData.emojis}
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interactive Tips & Info */}
              {interactiveData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full rounded-none bg-slate-100 grid grid-cols-3">
                          <TabsTrigger value="tips" className="rounded-none">
                            <span className="text-lg mr-1">🔹</span>
                            <span className="hidden sm:inline">Quick Tips</span>
                            <span className="sm:hidden text-xs">Tips</span>
                          </TabsTrigger>
                          <TabsTrigger value="health" className="rounded-none">
                            <span className="text-lg mr-1">💪</span>
                            <span className="hidden sm:inline">Health</span>
                            <span className="sm:hidden text-xs">Health</span>
                          </TabsTrigger>
                          <TabsTrigger value="recipe" className="rounded-none">
                            <span className="text-lg mr-1">👨‍🍳</span>
                            <span className="hidden sm:inline">Recipe</span>
                            <span className="sm:hidden text-xs">Recipe</span>
                          </TabsTrigger>
                        </TabsList>

                        <div className="min-h-[250px] sm:min-h-[300px]">
                          <TabsContent value="tips" className="p-4 sm:p-6 space-y-3 m-0">
                            <motion.div
                              key="tips-content"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {interactiveData.quickTips.map((tip: string, idx: number) => (
                                <motion.div 
                                  key={idx} 
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="flex gap-3 pb-3 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 p-2 rounded transition-colors"
                                >
                                  <div className="text-2xl flex-shrink-0">{['🔹', '🔸', '🔷', '🔶'][idx % 4]}</div>
                                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{tip}</p>
                                </motion.div>
                              ))}
                            </motion.div>
                          </TabsContent>

                          <TabsContent value="health" className="p-4 sm:p-6 m-0">
                            <motion.div
                              key="health-content"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                            >
                              <p className="text-sm sm:text-base font-semibold text-green-900 mb-3 flex items-center gap-2">
                                <span className="text-2xl">💪</span> Health Benefit
                              </p>
                              <p className="text-base sm:text-lg text-green-800 leading-relaxed">{interactiveData.healthBenefit}</p>
                            </motion.div>
                          </TabsContent>

                          <TabsContent value="recipe" className="p-4 sm:p-6 m-0">
                            <motion.div
                              key="recipe-content"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                            >
                              <p className="text-sm sm:text-base font-semibold text-orange-900 mb-3 flex items-center gap-2">
                                <span className="text-2xl">👨‍🍳</span> Recipe & Usage Idea
                              </p>
                              <p className="text-base sm:text-lg text-orange-800 leading-relaxed">{interactiveData.recipe}</p>
                            </motion.div>
                          </TabsContent>
                        </div>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <motion.div
          key={`products-${transitionKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="font-bold text-lg sm:text-2xl mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> 
            <span>Available Products</span>
            <span className="text-sm font-normal text-muted-foreground ml-auto">({items.length})</span>
          </h3>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((item, idx) => {
                const itemPrices = prices.filter(p => p.itemId === item.id);
                const lowestPrice = itemPrices.length > 0 
                  ? Math.min(...itemPrices.map(p => p.price))
                  : 0;
                const shopWithLowestPrice = itemPrices.find(p => p.price === lowestPrice);
                const shop = shopWithLowestPrice ? shops.find(s => s.id === shopWithLowestPrice.shopId) : null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Card className="overflow-hidden border-none shadow-sm group hover:shadow-lg transition-all hover:scale-105 h-full flex flex-col cursor-pointer bg-white hover:bg-blue-50">
                      <div className="w-full h-32 sm:h-40 bg-slate-200 overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e2e8f0' width='200' height='200'/%3E%3C/svg%3E";
                          }}
                        />
                        {shopWithLowestPrice?.isOffer && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg"
                          >
                            🔥 Deal
                          </motion.div>
                        )}
                      </div>
                      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm truncate text-slate-900">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">per {item.unit}</p>
                        </div>
                        
                        {lowestPrice > 0 && (
                          <div className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg">
                            <p className="text-xs text-slate-600 font-medium">Best Price</p>
                            <p className="text-base sm:text-lg font-bold text-primary">₹{lowestPrice}</p>
                            {shop && (
                              <p className="text-xs text-slate-600 mt-1 truncate font-medium">{shop.name}</p>
                            )}
                          </div>
                        )}
                        
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-md transition-all text-xs sm:text-sm"
                          onClick={() => addToCart(item.id)}
                          data-testid={`button-add-${item.id}`}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Compare
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 sm:p-12 text-center">
              <p className="text-muted-foreground text-base sm:text-lg">No products available in this category</p>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}
