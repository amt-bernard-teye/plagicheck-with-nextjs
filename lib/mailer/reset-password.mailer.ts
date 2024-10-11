import * as ejs from "ejs";
import path from "path";

import { BaseMailer } from "./base.mailer";

type ResetPasswordDetails = {
  name: string;
  email: string;
  url: string;
}

export class ResetPasswordMailer extends BaseMailer<ResetPasswordDetails> {
  public constructor() {
    const title = "Password Reset";
    super(title);
  }


  protected getHtmlContent(content: ResetPasswordDetails): Promise<string> {
    const templatePath = path.join(process.cwd(), "public", "templates", "reset-password.ejs");
    return ejs.renderFile(templatePath, content);
  }

  
  async sendMail(content: ResetPasswordDetails): Promise<void> {
    const emailContent = await this.getHtmlContent(content);
    const transporter = this.createTransporter();
    await transporter.sendMail({
      subject: this.title,
      from: {
        address: process.env.MAIL_ADDRESS!,
        name: process.env.MAIL_NAME!
      },
      html: emailContent,
      to: content.email,
      headers: {
        "Content-type": "text/html"
      }
    });
  }
}