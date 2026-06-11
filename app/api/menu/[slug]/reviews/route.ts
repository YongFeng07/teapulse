import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const drink = await prisma.drink.findUnique({ where: { slug }, select: { id: true } });
    if (!drink) return NextResponse.json([], { status: 200 });

    const reviews = await prisma.review.findMany({
      where: { drinkId: drink.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const { rating, comment } = await req.json();
    if (!rating || rating < 1 || rating > 5 || !comment?.trim()) {
      return NextResponse.json({ error: "Rating 1-5 and comment required" }, { status: 400 });
    }
    const drink = await prisma.drink.findUnique({ where: { slug }, select: { id: true } });
    if (!drink) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Check existing review
    const existing = await prisma.review.findFirst({ where: { drinkId: drink.id, userId: session.user.id } });
    if (existing) return NextResponse.json({ error: "You've already reviewed this drink" }, { status: 400 });

    const review = await prisma.review.create({
      data: { drinkId: drink.id, userId: session.user.id, rating, comment: comment.trim() },
      include: { user: { select: { name: true } } },
    });

    // Update drink rating
    const allReviews = await prisma.review.findMany({ where: { drinkId: drink.id }, select: { rating: true } });
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await prisma.drink.update({
      where: { id: drink.id },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
