// SAMPLE DATA – sirf demo ke liye. Phase 4 mein database se replace hoga.
export const categories = [
  "Steamed Momos",
  "Fried Momos",
  "Tandoori Momos",
  "Kurkure Momos",
  "Gravy Momos",
];

export const menuItems = [
  // Steamed
  { id: "m1", category: "Steamed Momos", name: "Veg Steamed Momo", description: "Cabbage, carrot aur herbs ki soft filling. 6 pcs.", price: 90, veg: true, bestseller: true, recommended: false, available: true },
  { id: "m2", category: "Steamed Momos", name: "Paneer Steamed Momo", description: "Masaledaar paneer filling. 6 pcs.", price: 110, veg: true, bestseller: false, recommended: true, available: true },
  { id: "m3", category: "Steamed Momos", name: "Chicken Steamed Momo", description: "Juicy chicken filling, garam parosa jata hai. 6 pcs.", price: 110, veg: false, bestseller: true, recommended: false, available: true },
  // Fried
  { id: "m4", category: "Fried Momos", name: "Veg Fried Momo", description: "Bahar se crispy, andar se rasila. 6 pcs.", price: 100, veg: true, bestseller: false, recommended: false, available: true },
  { id: "m5", category: "Fried Momos", name: "Chicken Fried Momo", description: "Crispy fried chicken momo. 6 pcs.", price: 130, veg: false, bestseller: true, recommended: false, available: true },
  // Tandoori
  { id: "m6", category: "Tandoori Momos", name: "Paneer Tandoori Momo", description: "Smoky tandoori masala mein paneer momo. 6 pcs.", price: 150, veg: true, bestseller: false, recommended: true, available: true },
  { id: "m7", category: "Tandoori Momos", name: "Chicken Tandoori Momo", description: "Tandoor mein sekey hue spicy chicken momo. 6 pcs.", price: 170, veg: false, bestseller: false, recommended: true, available: false },
  // Kurkure
  { id: "m8", category: "Kurkure Momos", name: "Veg Kurkure Momo", description: "Extra crunchy coating ke saath. 6 pcs.", price: 130, veg: true, bestseller: false, recommended: false, available: true },
  { id: "m9", category: "Kurkure Momos", name: "Chicken Kurkure Momo", description: "Crunchy coating, spicy chicken filling. 6 pcs.", price: 160, veg: false, bestseller: false, recommended: true, available: true },
  // Gravy
  { id: "m10", category: "Gravy Momos", name: "Chicken Gravy Momo", description: "Masaledaar gravy mein dube hue momos. 6 pcs.", price: 170, veg: false, bestseller: false, recommended: false, available: true },
  { id: "m11", category: "Gravy Momos", name: "Veg Gravy Momo", description: "Tikhi gravy mein veg momos. 6 pcs.", price: 140, veg: true, bestseller: false, recommended: false, available: true },
  // Soups
//   { id: "m12", category: "Soups", name: "Veg Manchow Soup", description: "Tikha aur garam, crispy noodles ke saath.", price: 90, veg: true, bestseller: false, recommended: false, available: true },
//   { id: "m13", category: "Soups", name: "Chicken Clear Soup", description: "Halka aur sehat bhara.", price: 100, veg: false, bestseller: false, recommended: false, available: true },
//   // Chowmein & Rice
//   { id: "m14", category: "Chowmein & Rice", name: "Veg Hakka Noodles", description: "Wok mein tosse hue veg noodles.", price: 110, veg: true, bestseller: false, recommended: false, available: true },
//   { id: "m15", category: "Chowmein & Rice", name: "Chicken Fried Rice", description: "Smoky wok flavour ke saath.", price: 140, veg: false, bestseller: false, recommended: false, available: true },
//   // Sides
//   { id: "m16", category: "Sides & Dips", name: "Extra Red Chutney", description: "Hamari signature red chutney.", price: 20, veg: true, bestseller: false, recommended: false, available: true },
//   { id: "m17", category: "Sides & Dips", name: "Peri Peri Fries", description: "Crispy fries, peri peri masala ke saath.", price: 90, veg: true, bestseller: false, recommended: false, available: true },
//   // Beverages
//   { id: "m18", category: "Beverages", name: "Masala Lemon Soda", description: "Chatpata aur thanda.", price: 50, veg: true, bestseller: false, recommended: false, available: true },
//   { id: "m19", category: "Beverages", name: "Cold Coffee", description: "Creamy aur thanda.", price: 80, veg: true, bestseller: false, recommended: false, available: true },
//   // Desserts
//   { id: "m20", category: "Desserts", name: "Chocolate Fried Momo", description: "Pighli chocolate se bhare crispy momo. 4 pcs.", price: 110, veg: true, bestseller: false, recommended: true, available: true },
];