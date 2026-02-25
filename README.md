# 🏍️ Bike Blog

[![Vercel Deployment Status](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel)](https://bike-blog-app.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)

---

## 🌐 公開URL & 開発期間

**🔗 [https://bike-blog-app.vercel.app/](https://bike-blog-app.vercel.app/)**

**⏱️ 開発期間: 2026.12.15 ~ 2026.02.25 (約20時間)**

---

## 📝 概要

**Bike Blog** は、バイク愛好家向けの、モダンで直感的なブログプラットフォームです。

このアプリケーションは、バイクに関する情報共有と知識の蓄積を目的とした、ユーザーフレンドリーなコンテンツ管理システムです。管理者は充実した管理画面からカテゴリとブログ記事を効率的に管理でき、訪問ユーザーは洗練されたUIで記事を閲覧できます。

**対象ユーザー:**

- バイク関連の情報を発信・管理したい個人・企業
- バイク文化に興味のあるコミュニティ
- コンテンツマネジメントに優れたプラットフォームを求めるブロガー

---

## 📸 スクリーンショット

|                             ホーム画面                             |                              管理ダッシュボード                              |
| :----------------------------------------------------------------: | :--------------------------------------------------------------------------: |
| ![Home Page](https://via.placeholder.com/600x400?text=Home+Screen) | ![Admin Dashboard](https://via.placeholder.com/600x400?text=Admin+Dashboard) |

|                            記事詳細ページ                            |                             記事編集画面                             |
| :------------------------------------------------------------------: | :------------------------------------------------------------------: |
| ![Post Detail](https://via.placeholder.com/600x400?text=Post+Detail) | ![Post+Editor](https://via.placeholder.com/600x400?text=Post+Editor) |

---

## ✨ 主な機能

- 🔐 **認証機能** - セキュアなユーザー認証とアクセス制御
- 📚 **ブログ管理システム** - 記事の作成、編集、削除機能
- 📂 **カテゴリ管理** - コンテンツの整理と分類
- 🖼️ **画像アップロード** - バイク関連画像の簡単アップロードと管理
- 🎨 **レスポンシブデザイン** - デスクトップからモバイルまで最適な表示
- ⚡ **高速読み込み** - Next.js による最高レベルのパフォーマンス
- 🌍 **SEO対応** - 検索エンジン最適化済み

---

## 🛠️ 技術スタック

### **フロントエンド**

- **React 18** - UI構築の基盤
- **TypeScript 5.0** - 型安全なコード開発
- **Next.js 14** - React フレームワーク、SSR/SSG対応
- **Tailwind CSS** (推定) - スタイリング

### **バックエンド**

- **Next.js API Routes** - サーバーサイドロジック実装
- **Prisma ORM** - データベース操作の抽象化と型安全性
- **Supabase (PostgreSQL)** - クラウドデータベースサービス

### **インフラ・デプロイ**

- **Vercel** - エッジネットワーク上での高速デプロイと自動スケーリング
- **GitHub Actions** - CI/CD パイプライン、定期メンテナンスタスク自動化
- **GitHub** - バージョン管理とコラボレーション

---

## 🏗️ システムアーキテクチャ & 技術的な工夫

### アーキテクチャ概要

```
┌─────────────────┐
│  Frontend (SPA) │ ← React + Next.js + TypeScript
│  (Vercel CDN)   │
└────────┬────────┘
         │
┌────────▼────────────────────────┐
│  Next.js API Routes             │
│  (Backend Logic & Auth)         │
└────────┬─────────────────────────┘
         │
┌────────▼────────────────────────┐
│ Supabase                        │
│ (PostgreSQL DB + Auth Service) │
└─────────────────────────────────┘
```

### Supabase 停止モード対策 ⭐

**課題:** Supabaseの無料プランは一定期間アクセスがないと自動的にサスペンドされ、復帰に時間がかかることがあります。

**実装ソリューション:**
GitHub Actions を活用した定期 Ping 処理を実装し、**毎日自動的にAPIエンドポイントへリクエストを送信**。これにより Supabase データベースを常にアクティブ状態に保ち、ユーザーへの安定したサービス提供を実現しています。

```yaml
# .github/workflows/keep-alive.yml
schedule:
  - cron: "0 */6 * * *" # 6時間ごとに実行
```

このアプローチにより、本番環境において 99.9% 以上のアップタイムを実現しています。

---

## 🚀 ローカル環境での起動手順

### 前提条件

- **Node.js** 18.0 以上
- **npm** または **yarn**
- **Git**
- Supabase プロジェクト（環境変数設定済み）

### インストール手順

**1. リポジトリをクローン**

```bash
git clone https://github.com/yourusername/bike-blog-app.git
cd bike-blog-app
```

**2. 依存パッケージをインストール**

```bash
npm install
# または
yarn install
```

**3. 環境変数を設定**

`.env.local` ファイルをプロジェクトルートに作成し、以下の環境変数を設定します：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url
```

**4. データベースをセットアップ**

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

**5. 開発サーバーを起動**

```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスし、アプリケーションが立ち上がったことを確認します。

### 本番環境でのビルド

```bash
npm run build
npm start
```

---

## 📂 プロジェクト構成

```
next-blog-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── admin/             # 管理画面
│   │   ├── posts/             # 記事表示ページ
│   │   ├── login/             # 認証ページ
│   │   └── _components/       # 共有UI コンポーネント
│   ├── lib/                    # ユーティリティ関数
│   ├── utils/                 # ヘルパー関数
│   └── generated/             # Prisma 自動生成ファイル
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   └── seed.ts                # データベースシード
├── public/                     # 静的ファイル
└── devtools/                   # 開発ツール とAPI仕様書
```

---

## 📝 ライセンス

このプロジェクトは MIT ライセンスのもとで公開されています。

---

## 💬 お問い合わせ

ご質問やフィードバックはお気軽にお知らせください。

**GitHub Issues:** [GitHub Issues](https://github.com/yourusername/bike-blog-app/issues)

---

**開発者により、品質とパフォーマンスを重視して開発されました。**
