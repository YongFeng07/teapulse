export type SugarLevel = "0%" | "25%" | "50%" | "75%" | "100%";
export type IceLevel = "No ice" | "Less" | "Normal";
export type Topping = "pearls" | "jelly" | "pudding";

export const SUGAR_LEVELS: SugarLevel[] = ["0%", "25%", "50%", "75%", "100%"];
export const ICE_LEVELS: IceLevel[] = ["No ice", "Less", "Normal"];
export const TOPPINGS: Topping[] = ["pearls", "jelly", "pudding"];

export const TOPPING_PRICE = 2.5;

export type MembershipTier = "Bronze" | "Silver" | "Gold" | "VIP";

export interface CartItemInput {
  drinkId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sugarLevel: string;
  iceLevel: string;
  toppings: string[];
}

export interface CartItem extends CartItemInput {
  id: string;
}

export interface DrinkWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDesc: string;
  price: number;
  image: string;
  images: string;
  ingredients: string;
  badges: string;
  calories: number;
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  isAvailable: boolean;
  isSeasonal: boolean;
  category: { id: string; name: string; slug: string };
}

export interface ReviewType {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

export interface OrderWithDetails {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  total: number;
  pointsEarned: number;
  notes: string | null;
  createdAt: string;
  store: { id: string; name: string; address: string; city: string };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    sugarLevel: string;
    iceLevel: string;
    toppings: string;
    subtotal: number;
    drink: { id: string; name: string; image: string };
  }>;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  points: number;
  tier: MembershipTier;
  pointsToNextTier: number | null;
  nextTier: MembershipTier | null;
}
