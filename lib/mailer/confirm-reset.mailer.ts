import * as ejs from "ejs";
import path from "path";

import { BaseMailer } from "./base.mailer";

type ConfirmResetDetails = {
  name: string;
  email: string;
}

export class ConfirmResetMailer extends BaseMailer<ConfirmResetDetails> {
  public constructor() {
    const title = "Password Reset Completed";
    super(title);
  }


  protected getHtmlContent(content: ConfirmResetDetails): Promise<string> {
    const templatePath = path.join(process.cwd(), "public", "templates", "confirm-reset.ejs");
    return ejs.renderFile(templatePath, content);
  }

  
  async sendMail(content: ConfirmResetDetails): Promise<void> {
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