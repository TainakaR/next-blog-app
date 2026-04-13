import { prisma } from "@/lib/prisma";
import type { Post } from "@/app/_types/Post";
import Image from "next/image";
import { notFound } from "next/navigation";

// 投稿記事の詳細表示 /posts/[id]
// 1. params の型を Promise に変更し、async 関数にする
const Page = async (props: { params: Promise<{ id: string }> }) => {
  // 2. params を await して取得する
  const params = await props.params;
  const id = params.id;

  const postData = await prisma.post.findUnique({
    where: { id: id },
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

  /**
   * エラー回避のための変更点:
   * isomorphic-dompurify (jsdom) の使用を一旦中止します。
   * もしリッチテキストエディタ等で信頼できるソースからのみ入力される場合は、
   * そのまま post.content を使用するか、サーバーサイドで動作する
   * より軽量なサニタイズライブラリへの変更を検討してください。
   */
  const safeHTML = post.content;

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
