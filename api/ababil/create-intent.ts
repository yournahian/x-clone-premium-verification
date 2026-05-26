const ABABIL_API_URL = "https://testnetv1.ababilpay.xyz/api/v1";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ABABIL_API_KEY = process.env.ABABIL_PAY_API_KEY;

  try {
    const { planId, amount_usdc, description } = req.body;

    console.log(`[Vercel Serverless] Creating Ababil Pay Intent: Plan = ${planId}, Amount = ${amount_usdc} USDC`);

    // Dynamically construct redirect URLs back to the Vercel deployment URL
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host || 'localhost:3000';
    const origin = `${protocol}://${host}`;

    const redirectUrl = `${origin}/?payment_status=success&plan=${planId}`;
    const cancelUrl = `${origin}/?payment_status=cancelled`;

    console.log(`[Vercel Serverless] Redirect URLs -> Success: ${redirectUrl}, Cancel: ${cancelUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000); // 15 seconds timeout

    try {
      const response = await fetch(`${ABABIL_API_URL}/x402/intents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ABABIL_API_KEY}`
        },
        body: JSON.stringify({
          amount_usdc: Number(amount_usdc),
          description: description || `X Premium Subscription for ${planId}`,
          order_id: `x_verify_${planId}_${Date.now()}`,
          redirect_url: redirectUrl,
          cancel_url: cancelUrl,
          metadata: {
            applet_host: host,
            selected_plan: planId
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      console.log(`[Vercel Serverless] Ababil API response status: ${response.status}`, data);

      if (response.ok && data.success) {
        const checkoutUrl = data.data.checkout_url || `https://testnetv1.ababilpay.xyz/pay/${data.data.intent_id}`;
        res.status(200).json({
          success: true,
          checkout_url: checkoutUrl,
          intent_id: data.data.intent_id
        });
      } else {
        const errorMsg = data.error?.message || "Failed to initiate payment intent with Ababil Pay API";
        throw new Error(errorMsg);
      }
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      console.warn("[Vercel Serverless] Ababil Pay fetch failed or timed out. Falling back to High-Fidelity Simulator:", fetchErr.message);

      // Fallback: Create a simulated checkout URL pointing to your deployment
      const simIntentId = `sim_intent_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const localSimCheckoutUrl = `${origin}/?ababil_sim=true&intent_id=${simIntentId}&plan=${planId}&amount=${amount_usdc}`;

      res.status(200).json({
        success: true,
        checkout_url: localSimCheckoutUrl,
        intent_id: simIntentId,
        is_simulated: true
      });
    }
  } catch (err: any) {
    console.error("[Vercel Serverless] Exception:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error occurred while creating intent"
    });
  }
}
