import { prisma } from "@/lib/prisma";
import type { Post } from "@/app/_types/Post";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { notFound } from "next/navigation";

// 投稿記事の詳細表示 /posts/[id]
const Page = async ({ params }: { params: { id: string } }) => {
  const postData = await prisma.post.findUnique({
    where: { id: params.id },
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
  });

  if (!postData) {
    notFound();
  }

  const post: Post = {
    id: postData.id,
    title: postData.title,
    content: postData.content,
    createdAt: postData.createdAt.toISOString(),
    coverImage: {
      url: postData.coverImageURL,
      height: 768,
      width: 1365,
    },
    categories: postData.categories.map((pc) => pc.category),
  };

  // HTMLコンテンツのサニタイズ
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  return (
    <main>
      <div className="space-y-2">
        <div className="mb-2 text-2xl font-bold">{post.title}</div>
        <div>
          <Image
            src={post.coverImage.url}
            alt="Example Image"
            width={post.coverImage.width}
            height={post.coverImage.height}
            priority
            className="rounded-xl"
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
      </div>
    </main>
  );
};

export default Page;
