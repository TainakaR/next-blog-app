import { prisma } from "@/lib/prisma";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";

const Page = async () => {
  const postsData = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      coverImageURL: true,
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const posts: Post[] = postsData.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    coverImage: {
      url: post.coverImageURL,
      height: 768,
      width: 1365,
    },
    categories: post.categories.map((pc) => pc.category),
  }));

  return (
    <main>
      <div className="mb-2 text-2xl font-bold">Main</div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Page;
