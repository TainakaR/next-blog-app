"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSpinner,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { Post } from "@/app/_types/Post";

const Page = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 初回ロード時に一覧を取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/posts");
        if (!res.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        alert("記事の読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
        読み込み中...
      </div>
    );
  }

  const handleDelete = async (post: Post) => {
    if (!confirm(`記事「${post.title}」を削除してもよろしいですか？`)) {
      return;
    }

    try {
      setIsDeleting(true);
      // DELETEリクエストを送信 (APIのパスは /api/admin/posts/[id])
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "削除に失敗しました");
      }

      // 成功したら、表示されているリストからその記事を除外する
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      alert("削除しました");
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">投稿記事の管理</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          新規作成
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="border border-slate-400 p-3">
            {/* 日付とカテゴリ */}
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
              </div>
            </div>

            {/* タイトル */}
            <div className="mb-1 text-lg font-bold">{post.title}</div>

            {/* 本文（HTML表示） */}
            <div
              className="line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
                }),
              }}
            />

            <div className="mt-2 flex justify-end gap-2">
              <Link
                href={`/admin/posts/${post.id}`}
                className="inline-flex items-center rounded bg-indigo-400 px-3 py-1 text-white transition-colors hover:bg-indigo-600"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                編集
              </Link>
              <button
                onClick={() => handleDelete(post)}
                disabled={isDeleting}
                className="ml-2 inline-flex items-center rounded bg-red-500 px-3 py-1 text-white hover:bg-red-800"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Page;
