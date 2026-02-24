import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// ▼ 変更点1: DB用の型を「PrismaPost」という別名でインポートして名前被りを防ぐ
import type { Post as PrismaPost } from "@/generated/prisma/client"; // ※環境によっては "@prisma/client" の場合もあります

export const revalidate = 0; // ◀ サーバサイドのキャッシュを無効化する設定
export const dynamic = "force-dynamic"; // ◀ 〃

// ▼ 変更点2: フロントエンド用の型をインポート
import type { Post } from "@/app/_types/Post";

// ■ 一覧取得 (GET)
export const GET = async (req: NextRequest) => {
  try {
    // DBから取得するときは PrismaPost 型に近いデータが返ってきますが
    // selectを使っているため厳密にはPrismaPostの部分集合になります
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

    // ▼ 変更点3: ここはフロントエンド用の「Post」型を使います
    // エラーが消えるはずです
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

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "記事の取得に失敗しました" },
      { status: 500 },
    );
  }
};

// ■ 新規作成 (POST) ※もし既存コードにあれば
type RequestBody = {
  title: string;
  content: string;
  coverImageURL: string;
  categoryIds: string[];
};

export const POST = async (req: NextRequest) => {
  try {
    const requestBody: RequestBody = await req.json();
    const { title, content, coverImageURL, categoryIds } = requestBody;

    // ... (省略: カテゴリチェックなど) ...

    // ▼ 変更点4: DB操作の戻り値を受け取る箇所は「PrismaPost」型を使います
    // (または型注釈を削除して推論に任せてもOKです)
    const post: PrismaPost = await prisma.post.create({
      data: {
        title,
        content,
        coverImageURL,
      },
    });

    // ... (省略: 中間テーブル作成など) ...

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "投稿記事の作成に失敗しました" },
      { status: 500 },
    );
  }
};
