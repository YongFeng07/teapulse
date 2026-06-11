import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPostBySlug, updatePost, deletePost } from "@/services/blog.service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "yongfeng3318@gmail.com") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { slug } = await params;
    const post = await updatePost(slug, await req.json());
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "yongfeng3318@gmail.com") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { slug } = await params;
    await deletePost(slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
