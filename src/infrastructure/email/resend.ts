import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmation";

// RESEND_API_KEY ortam değişkenine eklenmelidir (örn. .env)
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function sendOrderConfirmationEmail(
  toEmail: string,
  customerName: string,
  orderNumber: string,
  totalAmount: string,
  items: Array<{ name: string; quantity: number; size?: string | null }>
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Simulating email send to", toEmail);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Last Dance <onboarding@resend.dev>", // Prod'da doğrulanmış domain kullanılmalı
      to: [toEmail],
      subject: `Siparişiniz Onaylandı - ${orderNumber}`,
      react: OrderConfirmationEmail({
        customerName,
        orderNumber,
        totalAmount,
        items,
      }),
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}
