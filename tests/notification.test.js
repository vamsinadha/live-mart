// tests/notification.test.js
const NotificationService = require("../domain/services/NotificationService");

jest.mock("nodemailer", () => ({
  createTransport: () => ({ sendMail: jest.fn().mockResolvedValue(true) }),
}));

jest.mock("twilio", () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn().mockResolvedValue(true) },
  }));
});

describe("NotificationService", () => {
  test("notifyOrderUpdate should not throw when user has email/phone", async () => {
    const svc = new NotificationService();
    const user = { _id: "u1", email: "a@b.com", phone: "+911234567890" };
    const order = { _id: "o1", status: "DISPATCHED" };
    await expect(svc.notifyOrderUpdate(user, order)).resolves.not.toThrow();
  });

  test("pushSocket no-op without io", () => {
    const svc = new NotificationService();
    expect(() => svc.pushSocket("u1", "event", {})).not.toThrow();
  });
});
