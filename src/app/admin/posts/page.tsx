import { prisma } from "@/lib/prisma";
import type { Post } from "@/app/_types/Post";
import Link from "next/link";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";

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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">投稿記事の管理</h1>
        <Link
          href="/admin/posts/new"
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          新規作成
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="border border-slate-400 p-3">
            <div className="flex items-center justify-between">
              <div>{dayjs(post.createdAt).format("YYYY-MM-DD")}</div>
              <div className="flex space-x-1.5">
                {post.categories?.map((category) => (
                  <div
                    key={category.id}
                    className={twMerge(
                      "rounded-md px-2 py-0.5",
                      "text-xs font-bold",
                      "border border-slate-400 text-slate-500",
                    )}
                  >
                    {category.name}
                  </div>
                ))}
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="rounded bg-blue-500 px-2 py-1 text-xs text-white"
                >
                  編集
                </Link>
              </div>
            </div>
            <div className="mb-1 text-lg font-bold">{post.title}</div>
            <div
              className="line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
                }),
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default Page;
