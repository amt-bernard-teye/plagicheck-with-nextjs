import * as ejs from "ejs";
import path from "path";

import { UserInvitationDetails } from "../types/user-invitation-details.type";
import { BaseMailer } from "./base.mailer";

export class UserInvitationMailer extends BaseMailer<UserInvitationDetails> {
  public constructor() {
    const title = "Invitation to Join Plagiarism Checker System";
    super(title);
  }


  protected getHtmlContent(content: UserInvitationDetails): Promise<string> {
    const templatePath = path.join(process.cwd(), "public", "views", "invitation.ejs");
    return ejs.renderFile(templatePath, content);
  }

  async sendMail(content: UserInvitationDetails): Promise<void> {
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