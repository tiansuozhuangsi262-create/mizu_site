/**
 * Cloudflare Pages Functions - お問い合わせフォーム処理
 * パス: functions/api/contact.js
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
            company: formData.get('company') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            category: formData.get('category') || '',
            material: formData.get('material') || '',
            lot_qty: formData.get('lot_qty') || '',
            budget: formData.get('budget') || '',
            message: formData.get('message') || '',
            timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Ho_Chi_Minh' })
        };

        // バリデーション
        if (!data.name || !data.email) {
            const url = new URL(context.request.url);
            return Response.redirect(`${url.origin}/contact.html?error=required`, 302);
        }

        // ファイルの処理（オプション）
        const attachment = formData.get('attachment');
        let attachmentInfo = 'なし';
        if (attachment && attachment.size > 0) {
            attachmentInfo = `${attachment.name} (${(attachment.size / 1024).toFixed(1)}KB)`;
        }

        // Resend APIキーの確認
        const RESEND_API_KEY = context.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not set');
            return Response.redirect(`${origin}/contact.html?error=server&details=ConfigError`, 302);
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
                subject: `【お問い合わせ】${data.name}様より - 水圧転写技術`,
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
      <h2>💧 新しいお問い合わせ</h2>
    </div>
    <div class="content">
      
      <div class="section">
        <div class="section-title">📋 お客様情報</div>
        <div class="field">
          <div class="label">お名前</div>
          <div class="value">${data.name}</div>
        </div>
        <div class="field">
          <div class="label">貴社名</div>
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
        <div class="section-title">🔧 ご依頼製品について</div>
        <div class="field">
          <div class="label">製品ジャンル</div>
          <div class="value">${data.category}</div>
        </div>
        <div class="field">
          <div class="label">素材</div>
          <div class="value">${data.material || '（未入力）'}</div>
        </div>
        <div class="field">
          <div class="label">予定ロット数</div>
          <div class="value">${data.lot_qty || '（未入力）'}</div>
        </div>
        <div class="field">
          <div class="label">ご予算感</div>
          <div class="value">${data.budget || '（未入力）'}</div>
        </div>
        <div class="field">
          <div class="label">添付画像</div>
          <div class="value">${attachmentInfo}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">💬 お問い合わせ詳細</div>
        <div class="field">
          <div class="value">${data.message ? data.message.replace(/\n/g, '<br>') : '（未入力）'}</div>
        </div>
      </div>

      <div class="footer">
        <p><strong>送信日時:</strong> ${data.timestamp}</p>
        <p>このメールは Đại Đột Phá (ddp-hydro.com) のお問い合わせフォームから自動送信されました。</p>
      </div>
    </div>
  </div>
</body>
</html>
            `,
                text: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💧 新しいお問い合わせが届きました
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【 お客様情報 】
お名前: ${data.name}
貴社名: ${data.company || '（未入力）'}
メールアドレス: ${data.email}
電話番号: ${data.phone || '（未入力）'}

【 ご依頼製品について 】
製品ジャンル: ${data.category}
素材: ${data.material || '（未入力）'}
予定ロット数: ${data.lot_qty || '（未入力）'}
ご予算感: ${data.budget || '（未入力）'}
添付画像: ${attachmentInfo}

【 お問い合わせ詳細 】
${data.message || '（未入力）'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
送信日時: ${data.timestamp}
このメールは Đại Đột Phá (ddp-hydro.com) のお問い合わせフォームから自動送信されました。
            `
            }),
        });

        // URLのオリジンを取得
        const url = new URL(context.request.url);
        const origin = url.origin;

        if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error('Email sending failed:', errorText);
            return Response.redirect(`${origin}/contact.html?error=send&details=${encodeURIComponent(errorText.substring(0, 100))}`, 302);
        }

        // 成功時はサンクスページへリダイレクト
        return Response.redirect(`${origin}/contact.html?success=true`, 302);

    } catch (error) {
        console.error('Form submission error:', error);
        // エラー時も絶対URLでリダイレクト
        const url = new URL(context.request.url);
        const origin = url.origin;
        return Response.redirect(`${origin}/contact.html?error=server`, 302);
    }
}
