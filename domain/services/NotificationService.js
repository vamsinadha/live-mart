// domain/services/NotificationService.js
// CommonJS version so Jest tests using require() work without extra Jest config.

const nodemailer = require("nodemailer");
const Twilio = require("twilio");

function createEmailGateway() {
  const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } = process.env;
  if (EMAIL_USER && EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE || "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
    return {
      send: async (to, subject, text) => {
        if (!to) return null;
        return transporter.sendMail({
          from: process.env.EMAIL_USER,
          to,
          subject,
          text,
        });
      },
    };
  }
  return {
    send: async () => null,
  };
}

function createTwilioGateway() {
  const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env;
  if (TWILIO_SID && TWILIO_AUTH_TOKEN) {
    const client = Twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
    return {
      sendSMS: async (to, body) => {
        if (!to) return null;
        return client.messages.create({
          to,
          from: TWILIO_FROM || undefined,
          body,
        });
      },
    };
  }
  return {
    sendSMS: async () => null,
  };
}

class NotificationService {
  constructor(opts) {
    opts = opts || {};
    this.io = opts.io || null;
    this.emailGateway = createEmailGateway();
    this.twilioGateway = createTwilioGateway();
  }

  async notifyUserEmail(email, subject, text) {
    try {
      return await this.emailGateway.send(email, subject, text);
    } catch (err) {
      console.error("Email send error", err);
      return null;
    }
  }

  async notifyUserSMS(phone, text) {
    try {
      return await this.twilioGateway.sendSMS(phone, text);
    } catch (err) {
      console.error("SMS send error", err);
      return null;
    }
  }

  pushSocket(userId, event, payload) {
    if (!this.io || !userId) return;
    const room = `user_${userId}`;
    try {
      this.io.to(room).emit(event, payload);
    } catch (err) {
      console.error("Socket emit error", err);
    }
  }

  async notifyOrderUpdate(user, order) {
    const userId = (user && (user._id || user.id)) || user;
    const msg = `Order ${order._id || order.id} status: ${order.status}`;
    if (user && user.email)
      await this.notifyUserEmail(user.email, "Order update", msg);
    if (user && user.phone) await this.notifyUserSMS(user.phone, msg);
    this.pushSocket(userId, "order:update", {
      orderId: order._id || order.id,
      status: order.status,
    });
  }
}

module.exports = NotificationService;
