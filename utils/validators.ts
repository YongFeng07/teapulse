import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

export const orderSchema = z.object({
  storeId: z.string().min(1, "Please select a store"),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      drinkId: z.string(),
      name: z.string(),
      image: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      sugarLevel: z.string(),
      iceLevel: z.string(),
      toppings: z.array(z.string()),
    })
  ).min(1, "Cart is empty"),
});
