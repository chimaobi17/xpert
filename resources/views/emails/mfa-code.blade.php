<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login Code</title>
</head>
<body style="margin:0; padding:0; background:#f8f9fa; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa; padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background:#22c55e; padding:32px 40px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.5px;">XPERT</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;">
                            <h2 style="margin:0 0 8px; color:#1a1a1a; font-size:20px; font-weight:600;">Login Verification</h2>
                            <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.6;">
                                Hi {{ $userName }}, enter this code to complete your login.
                            </p>
                            <div style="background:#f0fdf4; border:2px solid #22c55e; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px;">
                                <span style="font-size:36px; font-weight:700; color:#16a34a; letter-spacing:8px;">{{ $otpCode }}</span>
                            </div>
                            <p style="margin:0; color:#9ca3af; font-size:12px; line-height:1.5;">
                                This code expires in 10 minutes. If you didn't try to log in, change your password immediately.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 40px 32px;">
                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:0 0 16px;">
                            <p style="margin:0; color:#9ca3af; font-size:11px; text-align:center;">
                                &copy; {{ date('Y') }} XPERT. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
