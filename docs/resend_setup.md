# Resend セットアップガイド

このプロジェクトでは、お問い合わせフォームのメール送信に [Resend](https://resend.com) を使用するように変更しました。
以下の手順に従って、Resend の設定と Cloudflare Pages への環境変数の追加を行ってください。

## 1. Resend アカウントの作成とドメイン設定

1.  [Resend](https://resend.com) にアクセスし、アカウントを作成（またはログイン）します。
2.  ダッシュボードのサイドバーから **Domains** を選択し、**Add Domain** をクリックします。
3.  ドメイン名 `ddp-hydro.com` を入力し、**Add** をクリックします。
4.  表示された **DNS Records** (MX, TXT, CNAME など) を、Cloudflare の DNS 設定に追加します。
    *   Cloudflare のダッシュボードにログインし、`ddp-hydro.com` の DNS 設定を開きます。
    *   Resend に表示されている Type, Name, Value をコピーして、Cloudflare にレコードを追加します。
    *   **注意**: Proxy status (雲のマーク) は **DNS only** (グレー) に設定してください。
5.  DNS レコードを追加したら、Resend の画面で **Verify DNS Records** をクリックします。ステータスが **Verified** になるまで待ちます（数分〜数時間かかる場合があります）。

## 2. API キーの取得

1.  Resend ダッシュボードのサイドバーから **API Keys** を選択します。
2.  **Create API Key** をクリックします。
3.  Key Name に適当な名前（例: `Cloudflare Pages`）を入力し、**Sending access** (または Full access) を選択して **Add** をクリックします。
4.  表示された API キー（`re_` で始まる文字列）をコピーします。**このキーは一度しか表示されないので、安全な場所に保存してください。**

## 3. Cloudflare Pages への環境変数設定

1.  Cloudflare ダッシュボードにログインし、**Workers & Pages** > **Overview** から対象のプロジェクト（`mizu_site`）を選択します。
2.  **Settings** タブをクリックし、サイドバーの **Environment variables** を選択します。
3.  **Production** 環境の **Add variable** をクリックします。
4.  以下の内容を入力して **Save** します。
    *   **Variable name**: `RESEND_API_KEY`
    *   **Value**: (手順2で取得した API キー)
5.  (任意) **Preview** 環境にも同様に設定したい場合は、Preview 側にも同じ変数を追加してください。

## 4. デプロイの再実行

環境変数を設定した後、変更を反映させるために新しいデプロイが必要です。
すでにコードは Resend 対応に変更されていますので、GitHub にプッシュするだけで自動的にデプロイされます。

```bash
git add .
git commit -m "Migrate to Resend API"
git push origin main
```

## 5. 動作確認

デプロイ完了後、ウェブサイトのお問い合わせフォームからテスト送信を行い、メールが届くか確認してください。
Resend のダッシュボード（**Emails**）でも送信ログを確認できます。
