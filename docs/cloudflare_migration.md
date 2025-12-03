# NetlifyからCloudflare Pagesへの移行ガイド

このドキュメントでは、現在の静的Webサイト（HTML/CSS/JS）をNetlifyからCloudflare Pagesへ移行する手順を説明します。

## 前提条件

*   GitHubアカウント（ソースコードがGitHubにあること）
*   Cloudflareアカウント

## 手順

### 1. GitHubへの最新コードのプッシュ

まず、ローカルの最新の変更がGitHubリポジトリにプッシュされていることを確認してください。

```bash
git add .
git commit -m "Cloudflare移行準備"
git push origin main
```

### 2. Cloudflare Pagesでのプロジェクト作成

1.  [Cloudflareダッシュボード](https://dash.cloudflare.com/)にログインします。
2.  左側のメニューから **Workers & Pages** を選択します。
3.  **アプリケーションの作成 (Create application)** ボタンをクリックします。
4.  **Pages** タブを選択し、**Gitに接続 (Connect to Git)** をクリックします。
5.  GitHubアカウントを連携し、移行したいリポジトリ（`mizu_site` など）を選択して、**セットアップの開始 (Begin setup)** をクリックします。

### 3. ビルドとデプロイの設定

このプロジェクトは静的なHTMLファイルで構成されているため、特別なビルド設定は不要です。

*   **プロジェクト名 (Project name)**: 任意の名前（例: `mizu-site`）
*   **プロダクションブランチ (Production branch)**: `main` (または `master`)
*   **フレームワーク プリセット (Framework preset)**: `None` (選択なし)
*   **ビルドコマンド (Build command)**: 空欄のまま
*   **ビルド出力ディレクトリ (Build output directory)**: 空欄のまま
    *   ※もし空欄でエラーになる場合や、特定のフォルダ（例: `public`）にHTMLがある場合はそのフォルダ名を指定しますが、現在の構成（ルートにHTMLがある）なら空欄で問題ありません。

設定を確認し、**保存してデプロイ (Save and Deploy)** をクリックします。

### 4. デプロイの確認

デプロイが完了すると、`https://<project-name>.pages.dev` というURLが発行されます。
このURLにアクセスし、サイトが正しく表示されるか確認してください。
特に以下の点を確認します：
*   トップページが表示されるか
*   サブページ（`company.html`など）へのリンクが機能するか
*   画像が表示されているか

### 5. カスタムドメインの設定（必要な場合）

独自ドメイン（例: `example.com`）を使用する場合は、以下の設定を行います。

1.  Cloudflare Pagesのプロジェクトページで **カスタムドメイン (Custom domains)** タブをクリックします。
2.  **カスタムドメインのセットアップ (Set up a custom domain)** をクリックします。
3.  使用したいドメイン名を入力し、**続行 (Continue)** をクリックします。
4.  Cloudflareの指示に従ってDNSレコードを設定します。
    *   ドメインが既にCloudflareで管理されている場合: 自動的にDNSレコードが追加されます。
    *   他のレジストラ（お名前.comなど）で管理されている場合: 表示されるCNAMEレコードをレジストラ側のDNS設定に追加するか、ネームサーバーをCloudflareに変更するよう指示される場合があります。

### 6. Netlify側の処理

移行が完了し、DNSの切り替えも終わって動作確認ができたら、Netlify側のプロジェクトを削除するか、カスタムドメインの設定を解除して競合を防ぎます。

## 注意点

*   **_redirects ファイル**: Netlifyで使用していた `_redirects` ファイルがある場合、Cloudflare Pagesでも同様に `_redirects` ファイルをルートディレクトリに置くことでリダイレクト設定が可能です。
*   **_headers ファイル**: `_headers` ファイルも同様にサポートされています。

現在のプロジェクトにはこれらの設定ファイルは見当たりませんでしたが、もし追加機能が必要な場合は[Cloudflare Pagesのドキュメント](https://developers.cloudflare.com/pages/configuration/redirects/)を参照してください。
