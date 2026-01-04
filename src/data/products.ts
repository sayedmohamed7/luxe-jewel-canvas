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
  images: string[]; // Multiple images for gallery
  description: string;
  fullDescription: string;
  details: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Éternité Diamond Ring",
    price: 12500,
    category: "Rings",
    image: productRing,
    images: [productRing, productBracelet, productNecklace],
    description: "A timeless solitaire ring featuring a brilliant-cut diamond set in 18k rose gold.",
    fullDescription: "The Éternité Diamond Ring represents the pinnacle of our craftsmanship. Each ring begins as a sketch, carefully refined by our master designers before being brought to life by our artisans. The brilliant-cut diamond, hand-selected for its exceptional clarity and fire, is set in 18k rose gold using a precision-engineered setting that maximizes light performance while ensuring security. The band features a subtle knife-edge profile that catches the light beautifully and sits comfortably on the finger.",
    details: [
      "18k Rose Gold",
      "1.2 Carat Diamond",
      "VVS1 Clarity",
      "E Color Grade",
    ],
    reviews: [
      {
        id: "r1",
        author: "Sarah M.",
        rating: 5,
        date: "December 2024",
        comment: "Absolutely stunning ring. The craftsmanship is impeccable and the diamond sparkles beautifully. Worth every dirham.",
        verified: true,
      },
      {
        id: "r2",
        author: "Fatima K.",
        rating: 5,
        date: "November 2024",
        comment: "Received this as an engagement ring and couldn't be happier. The attention to detail is remarkable.",
        verified: true,
      },
    ],
  },
  {
    id: "2",
    name: "Lumière Gold Bracelet",
    price: 8900,
    category: "Bracelets",
    image: productBracelet,
    images: [productBracelet, productRing, productEarrings],
    description: "An elegant bangle adorned with scattered diamonds, crafted in polished 18k gold.",
    fullDescription: "The Lumière Gold Bracelet embodies understated luxury. Crafted from solid 18k yellow gold, each bracelet is hand-polished to a mirror finish that gleams with every movement. The scattered diamonds are set in a seemingly random pattern that is, in fact, carefully calculated to maximize brilliance from every angle. The hinged clasp mechanism is both secure and easy to operate, making this piece as practical as it is beautiful.",
    details: [
      "18k Yellow Gold",
      "0.8 Carat Total Weight",
      "Hinged Clasp",
      "17cm Circumference",
    ],
    reviews: [
      {
        id: "r3",
        author: "Amira H.",
        rating: 5,
        date: "October 2024",
        comment: "This bracelet is elegant and timeless. I wear it every day and receive countless compliments.",
        verified: true,
      },
    ],
  },
  {
    id: "3",
    name: "Perle Drop Earrings",
    price: 4200,
    category: "Earrings",
    image: productEarrings,
    images: [productEarrings, productNecklace, productRing],
    description: "Lustrous South Sea pearls suspended from delicate gold chains.",
    fullDescription: "Our Perle Drop Earrings showcase the natural beauty of South Sea pearls. Each pearl is individually selected for its exceptional luster, smooth surface, and perfect symmetry. The pearls are suspended from fine 18k gold chains that create a graceful movement, allowing the pearls to catch and reflect light beautifully. The lightweight design ensures comfort for all-day wear, while the push-back closures provide security.",
    details: [
      "18k Yellow Gold",
      "10mm South Sea Pearls",
      "Push Back Closure",
      "4.5cm Drop Length",
    ],
    reviews: [],
  },
  {
    id: "4",
    name: "Céleste Pendant Necklace",
    price: 6800,
    category: "Necklaces",
    image: productNecklace,
    images: [productNecklace, productEarrings, productBracelet],
    description: "A captivating pear-shaped diamond pendant on a fine gold chain.",
    fullDescription: "The Céleste Pendant Necklace features a stunning pear-shaped diamond that appears to float on the décolletage. The diamond is set in an invisible mounting that allows maximum light to enter from all angles, creating exceptional brilliance. The accompanying chain is hand-crafted from 18k yellow gold using traditional techniques that ensure both durability and a luxurious drape. An adjustable clasp allows the pendant to be worn at multiple lengths.",
    details: [
      "18k Yellow Gold",
      "2.1 Carat Pear Diamond",
      "VS2 Clarity",
      "45cm Chain Length",
    ],
    reviews: [
      {
        id: "r4",
        author: "Nadia R.",
        rating: 5,
        date: "September 2024",
        comment: "The diamond catches light beautifully. This necklace has become my signature piece.",
        verified: true,
      },
      {
        id: "r5",
        author: "Layla S.",
        rating: 4,
        date: "August 2024",
        comment: "Beautiful necklace, excellent quality. Shipping was fast and packaging was luxurious.",
        verified: true,
      },
    ],
  },
];

export const categories = ["All", "Rings", "Necklaces", "Bracelets", "Earrings"];
