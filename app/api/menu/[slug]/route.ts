import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const drink = await prisma.drink.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!drink) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(drink);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const drink = await prisma.drink.update({
      where: { slug },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.longDesc !== undefined && { longDesc: body.longDesc }),
        ...(body.price !== undefined && { price: parseFloat(String(body.price)) }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.ingredients !== undefined && { ingredients: body.ingredients }),
        ...(body.badges !== undefined && { badges: body.badges }),
        ...(body.calories !== undefined && { calories: body.calories }),
        ...(body.isPopular !== undefined && { isPopular: body.isPopular }),
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
        ...(body.isSeasonal !== undefined && { isSeasonal: body.isSeasonal }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      },
    });
    return NextResponse.json(drink);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await prisma.drink.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
