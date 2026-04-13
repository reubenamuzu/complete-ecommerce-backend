import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send order confirmation email
const sendOrderConfirmation = async (userEmail, userName, order) => {
  if (!process.env.EMAIL_USER) return;

  try {
    const transporter = createTransporter();
    const itemsList = order.items
      .map((item) => `<li>${item.name} (Size: ${item.size}) x${item.quantity || 1} — ${order.amount}</li>`)
      .join("");

    await transporter.sendMail({
      from: `"Shop" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Order Confirmation",
      html: `
        <h2>Hi ${userName}, your order has been placed!</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Total:</strong> ${order.amount}</p>
        <ul>${itemsList}</ul>
        <p>Thank you for shopping with us!</p>
      `,
    });
  } catch (error) {
    console.log("Email error (order confirmation):", error.message);
  }
};

// Send order status update email
const sendStatusUpdate = async (userEmail, userName, order, newStatus) => {
  if (!process.env.EMAIL_USER) return;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Shop" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Update — ${newStatus}`,
      html: `
        <h2>Hi ${userName}, your order status has been updated.</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p>Thank you for shopping with us!</p>
      `,
    });
  } catch (error) {
    console.log("Email error (status update):", error.message);
  }
};

// Send return request status update email
const sendReturnUpdate = async (userEmail, userName, returnRequest) => {
  if (!process.env.EMAIL_USER) return;

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Shop" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Return Request Update — ${returnRequest.status}`,
      html: `
        <h2>Hi ${userName}, your return request has been updated.</h2>
        <p><strong>Order ID:</strong> ${returnRequest.orderId}</p>
        <p><strong>Status:</strong> ${returnRequest.status}</p>
        ${returnRequest.refundAmount ? `<p><strong>Refund Amount:</strong> ${returnRequest.refundAmount}</p>` : ""}
        ${returnRequest.adminNote ? `<p><strong>Note:</strong> ${returnRequest.adminNote}</p>` : ""}
      `,
    });
  } catch (error) {
    console.log("Email error (return update):", error.message);
  }
};

export { sendOrderConfirmation, sendStatusUpdate, sendReturnUpdate };
