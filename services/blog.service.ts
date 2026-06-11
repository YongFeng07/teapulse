import { prisma } from "@/lib/prisma";

export async function getPublishedPosts(page = 1, limit = 9) {
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
  ]);
  return { posts, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function createPost(data: {
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; author?: string; isPublished?: boolean;
}) {
  return prisma.blogPost.create({ data });
}

export async function updatePost(slug: string, data: Partial<{
  title: string; excerpt: string; content: string;
  coverImage: string; isPublished: boolean;
}>) {
  return prisma.blogPost.update({ where: { slug }, data });
}

export async function deletePost(slug: string) {
  return prisma.blogPost.delete({ where: { slug } });
}

export async function getAllPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}
