import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, full_name, playing_role, tshirt_type, tshirt_size, lower_size, jersey_number } =
      await req.json();

    if (!email || !full_name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const kitLabel = tshirt_type === "full_sleeves" ? "Full Sleeves" : tshirt_type === "half_sleeves" ? "Half Sleeves" : tshirt_type || "—";
    const sizeLabel = tshirt_size ? `${tshirt_size}` : "—";
    const lowerLabel = lower_size || "—";
    const jerseyLabel = jersey_number != null ? `#${jersey_number}` : "—";
    const roleLabel = playing_role || "—";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 24px;text-align:center;">
            <h1 style="margin:0;color:#e94560;font-size:28px;letter-spacing:1px;">BPCL 2</h1>
            <p style="margin:4px 0 0;color:#a0a0b0;font-size:13px;">Bareilly Corporate Premier League</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 24px;">
            <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:20px;">Registration Received!</h2>
            <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.5;">
              Hi <strong>${full_name}</strong>, your registration for <strong>BPCL 2 — Season 2026</strong> has been received. Here's a summary:
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 16px;font-size:14px;color:#888;width:40%;">Player Name</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a1a2e;font-weight:600;">${full_name}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:14px;color:#888;">Playing Role</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a1a2e;">${roleLabel}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 16px;font-size:14px;color:#888;">T-Shirt</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a1a2e;">${kitLabel} — Size ${sizeLabel}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:14px;color:#888;">Trackpant Size</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a1a2e;">${lowerLabel}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 16px;font-size:14px;color:#888;">Jersey Number</td>
                <td style="padding:10px 16px;font-size:14px;color:#1a1a2e;">${jerseyLabel}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:14px;color:#888;">Payment Status</td>
                <td style="padding:10px 16px;font-size:14px;color:#e94560;font-weight:600;">Pending Verification</td>
              </tr>
            </table>

            <p style="margin:24px 0 0;padding:16px;background:#fff8e1;border-left:4px solid #ffc107;border-radius:4px;font-size:14px;color:#555;line-height:1.5;">
              Your payment will be verified within <strong>24 hours</strong>. Once confirmed, you'll be added to the official players list.
            </p>

            <p style="margin:24px 0 0;font-size:14px;color:#555;line-height:1.5;">
              For any queries, reach out on WhatsApp:<br>
              <a href="https://wa.me/917310733916" style="color:#e94560;">+91 73107 33916</a> &nbsp;|&nbsp; <a href="https://wa.me/918384888601" style="color:#e94560;">+91 83848 88601</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1a2e;padding:20px 24px;text-align:center;">
            <p style="margin:0;color:#a0a0b0;font-size:12px;">
              &copy; 2026 Bareilly Corporate Premier League. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "BPCL 2", email: "help.bpcl2026@gmail.com" },
        to: [{ email, name: full_name }],
        subject: "BPCL 2 — Registration Received",
        htmlContent: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, messageId: data.messageId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
