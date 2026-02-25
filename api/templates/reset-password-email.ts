export const getResetPasswordEmailTemplate = (resetLink: string): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Yumm AI</title>
    <style>
        body {
            margin: 0;
            padding: 24px;
            background: #0f172a;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
        }
        .wrapper {
            max-width: 640px;
            margin: 0 auto;
            background: linear-gradient(135deg, #101827 0%, #0f172a 40%, #111827 100%);
            padding: 1px;
            border-radius: 18px;
        }
        .container {
            background: #ffffff;
            border-radius: 17px;
            overflow: hidden;
        }
        .hero {
            padding: 36px 32px 28px;
            background: radial-gradient(circle at 20% 20%, rgba(129, 153, 50, 0.12), transparent 35%),
                        radial-gradient(circle at 80% 0%, rgba(96, 116, 34, 0.12), transparent 35%),
                        linear-gradient(135deg, #819932 0%, #607422 100%);
            color: #ffffff;
            text-align: left;
        }
        .hero h1 {
            margin: 14px 0 8px;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.01em;
        }
        .hero p {
            margin: 0;
            color: #e2e8f0;
            font-size: 15px;
            line-height: 22px;
        }
        .content {
            padding: 32px;
        }
        .card {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 20px;
            background: #f9fafb;
            margin-bottom: 20px;
        }
        .card h2 {
            margin: 0 0 8px;
            font-size: 20px;
            color: #111827;
            letter-spacing: -0.01em;
        }
        .card p {
            margin: 0 0 12px;
            color: #4b5563;
            font-size: 15px;
            line-height: 22px;
        }
        .button {
            display: inline-block;
            margin: 12px 0 6px;
            background: linear-gradient(135deg, #8caf34 0%, #6f8729 100%);
            color: #ffffff !important;
            padding: 14px 28px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: -0.01em;
            box-shadow: 0 10px 30px rgba(111, 135, 41, 0.25);
        }
        .meta {
            margin-top: 14px;
            font-size: 13px;
            color: #6b7280;
        }
        .steps {
            padding-left: 18px;
            margin: 12px 0 0;
            color: #4b5563;
            font-size: 14px;
            line-height: 22px;
        }
        .link-box {
            margin-top: 16px;
            padding: 12px;
            border-radius: 10px;
            background: #f3f4f6;
            color: #374151;
            word-break: break-all;
            font-size: 13px;
        }
        .footer {
            padding: 20px 32px 28px;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            line-height: 20px;
        }
        .footer a {
            color: #607422;
            text-decoration: none;
            font-weight: 600;
        }
        @media (max-width: 640px) {
            body { padding: 16px; }
            .content { padding: 24px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="hero">
                <h1>Reset your password</h1>
                <p>We received a request to change your Yumm AI password. Use the button below to continue.</p>
            </div>
            <div class="content">
                <div class="card">
                    <h2>Action required</h2>
                    <p>For your security, this link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
                    <a href="${resetLink}" class="button">Reset password</a>
                    <div class="meta">Button not working? Copy and paste the link below into your browser:</div>
                    <div class="link-box">${resetLink}</div>
                </div>

                <div class="card" style="background:#ffffff;">
                    <h2>What happens next</h2>
                    <ol class="steps">
                        <li>Click “Reset password” to open the secure page.</li>
                        <li>Create a new password you have not used before.</li>
                        <li>Sign in with your new password to confirm the change.</li>
                    </ol>
                </div>
            </div>
            <div class="footer">
                Questions? Reply to this email or visit our <a href="https://yumm.ai">Help Center</a>.<br/>
                &copy; ${new Date().getFullYear()} Yumm AI.
            </div>
        </div>
    </div>
</body>
</html>
    `;
};
