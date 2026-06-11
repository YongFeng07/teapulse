// Email service placeholder — ready for Resend integration
// Add RESEND_API_KEY to .env and uncomment to enable

// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(email: string, orderNumber: string, total: number) {
  console.log(`📧 [EMAIL] Order confirmation to ${email}: #${orderNumber} - RM${total.toFixed(2)}`);
  // await resend.emails.send({
  //   from: "Tea Pulse <orders@teapulse.com>",
  //   to: email,
  //   subject: `Order #${orderNumber} confirmed! 🧋`,
  //   html: `<h1>Thanks for your order!</h1><p>Order #${orderNumber} for RM${total.toFixed(2)} is being prepared.</p>`,
  // });
}

export async function sendOrderStatusUpdate(email: string, orderNumber: string, status: string) {
  console.log(`📧 [EMAIL] Status update to ${email}: #${orderNumber} → ${status}`);
}

export async function sendPasswordReset(email: string, resetLink: string) {
  console.log(`📧 [EMAIL] Password reset to ${email}: ${resetLink}`);
}

export async function sendWelcomeEmail(email: string, name: string) {
  console.log(`📧 [EMAIL] Welcome to ${email}: Hello ${name}!`);
}

export async function sendGiftNotification(email: string, code: string) {
  console.log(`📧 [EMAIL] Gift notification to ${email}: code ${code}`);
}
