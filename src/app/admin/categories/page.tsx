"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

// カテゴリをフェッチしたときのレスポンスのデータ型
type CategoryApiResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// カテゴリ管理のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [categories, setCategories] = useState<CategoryApiResponse[] | null>(
    null,
  );

  // コンポーネントがマウントされたとき (初回レンダリングのとき) に1回だけ実行
  useEffect(() => {
    // ウェブAPI (/api/categories) からカテゴリの一覧をフェッチする関数の定義
    const fetchCategories = async () => {
      try {
        setIsLoading(true);

        // フェッチ処理の本体
        const requestUrl = "/api/categories";
        const res = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          setFetchErrorMsg(`${res.status} ${res.statusText} (${requestUrl})`);
          return;
        }

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        setFetchErrorMsg("カテゴリのフェッチ中にエラーが発生しました。");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (category: CategoryApiResponse) => {
    if (
      !window.confirm(
        `カテゴリ「${category.name}」を削除してもよろしいですか？`,
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "削除に失敗しました");
      }

      setCategories((prevCategories) => {
        if (!prevCategories) return null;
        return prevCategories.filter((c) => c.id !== category.id);
      });

      alert("削除しました。");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="mb-5 text-2xl font-bold">カテゴリ管理</div>

      <div className="mb-5">
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          カテゴリ新規作成
        </Link>
      </div>

      {isLoading && (
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          読み込み中...
        </div>
      )}

      {fetchErrorMsg && (
        <div className="text-red-500">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
          {fetchErrorMsg}
        </div>
      )}

      {categories && (
        <div className="grid gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={twMerge(
                "rounded border bg-black p-4 shadow-md",
                "flex items-center justify-between",
              )}
            >
              <div className="font-medium">{category.name}</div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/categories/${category.id}`}
                  className="inline-flex items-center rounded bg-indigo-400 px-3 py-1 text-white hover:bg-indigo-600"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1" />
                  編集
                </Link>

                <button
                  onClick={() => handleDelete(category)}
                  className="ml-2 inline-flex items-center rounded bg-red-500 px-3 py-1 text-white hover:bg-red-800"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;
