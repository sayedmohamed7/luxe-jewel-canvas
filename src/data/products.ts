import productRing from "@/assets/product-ring.jpg";
import productBracelet from "@/assets/product-bracelet.jpg";
import productEarrings from "@/assets/product-earrings.jpg";
import productNecklace from "@/assets/product-necklace.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  details: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Éternité Diamond Ring",
    price: 12500,
    category: "Rings",
    image: productRing,
    description: "A timeless solitaire ring featuring a brilliant-cut diamond set in 18k rose gold.",
    details: [
      "18k Rose Gold",
      "1.2 Carat Diamond",
      "VVS1 Clarity",
      "E Color Grade",
    ],
  },
  {
    id: "2",
    name: "Lumière Gold Bracelet",
    price: 8900,
    category: "Bracelets",
    image: productBracelet,
    description: "An elegant bangle adorned with scattered diamonds, crafted in polished 18k gold.",
    details: [
      "18k Yellow Gold",
      "0.8 Carat Total Weight",
      "Hinged Clasp",
      "17cm Circumference",
    ],
  },
  {
    id: "3",
    name: "Perle Drop Earrings",
    price: 4200,
    category: "Earrings",
    image: productEarrings,
    description: "Lustrous South Sea pearls suspended from delicate gold chains.",
    details: [
      "18k Yellow Gold",
      "10mm South Sea Pearls",
      "Push Back Closure",
      "4.5cm Drop Length",
    ],
  },
  {
    id: "4",
    name: "Céleste Pendant Necklace",
    price: 6800,
    category: "Necklaces",
    image: productNecklace,
    description: "A captivating pear-shaped diamond pendant on a fine gold chain.",
    details: [
      "18k Yellow Gold",
      "2.1 Carat Pear Diamond",
      "VS2 Clarity",
      "45cm Chain Length",
    ],
  },
];

export const categories = ["All", "Rings", "Necklaces", "Bracelets", "Earrings"];
