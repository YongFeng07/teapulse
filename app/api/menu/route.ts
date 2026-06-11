import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const [drinks, categories] = await Promise.all([
      prisma.drink.findMany({
        where: {
          isAvailable: true,
          ...(category ? { category: { slug: category } } : {}),
        },
        include: { category: true },
        orderBy: [{ isPopular: "desc" }, { createdAt: "asc" }],
      }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    return NextResponse.json({ drinks, categories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ drinks: [], categories: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, price, image, isPopular, isAvailable, categoryId, longDesc, ingredients, badges, calories } = body;
    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const drink = await prisma.drink.create({
      data: {
        name, slug: finalSlug,
        description: description || "",
        longDesc: longDesc || "",
        price: parseFloat(String(price)),
        image: image || "",
        ingredients: ingredients || "",
        badges: badges || "",
        calories: calories || 0,
        isPopular: isPopular ?? false,
        isAvailable: isAvailable ?? true,
        categoryId,
      },
    });
    return NextResponse.json(drink, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
