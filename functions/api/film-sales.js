/**
 * Cloudflare Pages Functions - フィルム販売お問い合わせフォーム処理
 * パス: functions/api/film-sales.js
 */

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    // スパム対策（honeypot）
    if (formData.get('bot-field')) {
      console.log('Spam detected');
      return new Response('Bad Request', { status: 400 });
    }

    // フォームデータの取得
    const data = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      company: formData.get('company') || '',
      message: formData.get('message') || '',
      product_width: formData.get('product_width') || '',
      product_pattern: formData.get('product_pattern') || '',
      product_rolls: formData.get('product_rolls') || '',
      product_total_length: formData.get('product_total_length') || '',
      timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Ho_Chi_Minh' })
    };

    // バリデーション
    if (!data.name || !data.email) {
      const url = new URL(context.request.url);
      return Response.redirect(`${url.origin}/film-sales.html?error=required`, 302);
    }

    // Resend APIキーの確認
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    // URLのオリジンを取得
    const url = new URL(context.request.url);
    const origin = url.origin;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return Response.redirect(`${origin}/film-sales.html?error=server&details=ConfigError`, 302);
    }

    // メール送信（Resend API経由）
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Đại Đột Phá <noreply@ddp-hydro.com>',
        to: ['ddp.hydrographic@gmail.com'],
        subject: `【フィルム販売お問い合わせ】${data.name}様より - 水転写フィルム`,
        html: `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;
      line-height: 1.8; 
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #00A3FF 0%, #0088CC 100%);
      color: white; 
      padding: 30px 20px; 
      text-align: center;
    }
    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content { 
      padding: 30px 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #00A3FF;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #00A3FF;
    }
    .product-info {
      background-color: #e0f2fe;
      border-left: 4px solid #00A3FF;
      padding: 20px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .product-info h3 {
      color: #00A3FF;
      margin: 0 0 15px 0;
      font-size: 18px;
    }
    .product-detail {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #bae6fd;
    }
    .product-detail:last-child {
      border-bottom: none;
    }
    .product-detail .label {
      font-weight: bold;
      color: #0369a1;
    }
    .product-detail .value {
      color: #111;
      font-weight: 600;
    }
    .field { 
      margin-bottom: 15px;
      background-color: #f9fafb;
      padding: 12px 15px;
      border-radius: 6px;
      border-left: 3px solid #00A3FF;
    }
    .label { 
      font-weight: bold; 
      color: #555;
      font-size: 13px;
      margin-bottom: 5px;
    }
    .value { 
      color: #111;
      font-size: 15px;
      word-wrap: break-word;
    }
    .footer { 
      margin-top: 30px; 
      padding-top: 20px; 
      border-top: 2px solid #e5e7eb; 
      font-size: 12px; 
      color: #6b7280;
      text-align: center;
    }
    .footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎬 フィルム販売お問い合わせ</h2>
    </div>
    <div class="content">
      
      <div class="product-info">
        <h3>📦 ご注文製品情報</h3>
        <div class="product-detail">
          <span class="label">製品名:</span>
          <span class="value">水転写印刷フィルム</span>
        </div>
        <div class="product-detail">
          <span class="label">フィルム幅:</span>
          <span class="value">${data.product_width}</span>
        </div>
        <div class="product-detail">
          <span class="label">パターン:</span>
          <span class="value">${data.product_pattern}</span>
        </div>
        <div class="product-detail">
          <span class="label">ロール数:</span>
          <span class="value">${data.product_rolls}ロール</span>
        </div>
        <div class="product-detail">
          <span class="label">合計長さ:</span>
          <span class="value">${data.product_total_length}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">👤 お客様情報</div>
        <div class="field">
          <div class="label">お名前</div>
          <div class="value">${data.name}</div>
        </div>
        <div class="field">
          <div class="label">会社名</div>
          <div class="value">${data.company || '（未入力）'}</div>
        </div>
        <div class="field">
          <div class="label">メールアドレス</div>
          <div class="value">${data.email}</div>
        </div>
        <div class="field">
          <div class="label">電話番号</div>
          <div class="value">${data.phone || '（未入力）'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💬 お問い合わせ内容</div>
        <div class="field">
          <div class="value">${data.message ? data.message.replace(/\n/g, '<br>') : '（未入力）'}</div>
        </div>
      </div>

      <div class="footer">
        <p><strong>送信日時:</strong> ${data.timestamp}</p>
        <p>このメールは Đại Đột Phá (ddp-hydro.com) のフィルム販売ページから自動送信されました。</p>
      </div>
    </div>
  </div>
</body>
</html>
            `,
        text: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 フィルム販売お問い合わせが届きました
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【 ご注文製品情報 】
製品名: 水転写印刷フィルム
フィルム幅: ${data.product_width}
パターン: ${data.product_pattern}
ロール数: ${data.product_rolls}ロール
合計長さ: ${data.product_total_length}

【 お客様情報 】
お名前: ${data.name}
会社名: ${data.company || '（未入力）'}
メールアドレス: ${data.email}
電話番号: ${data.phone || '（未入力）'}

【 お問い合わせ内容 】
${data.message || '（未入力）'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
送信日時: ${data.timestamp}
このメールは Đại Đột Phá (ddp-hydro.com) のフィルム販売ページから自動送信されました。
            `
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Email sending failed:', errorText);
      return Response.redirect(`${origin}/film-sales.html?error=send&details=${encodeURIComponent(errorText.substring(0, 100))}`, 302);
    }

    // 成功時はサンクスページへリダイレクト
    return Response.redirect(`${origin}/film-sales.html?success=true`, 302);

  } catch (error) {
    console.error('Form submission error:', error);
    const url = new URL(context.request.url);
    const origin = url.origin;
    return Response.redirect(`${origin}/film-sales.html?error=server`, 302);
  }
}
