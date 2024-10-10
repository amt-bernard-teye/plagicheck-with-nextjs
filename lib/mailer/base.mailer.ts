import { createTransport } from "nodemailer";

export abstract class BaseMailer<Type> {
  protected title: string;

  public constructor(title: string) {
    this.title = title;
  }

  protected createTransporter() {
    return createTransport({
      secure: true,
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT!,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      }
    });
  }

  protected abstract getHtmlContent(content: Type): Promise<string>;
  abstract sendMail(content: Type): Promise<void>;
}