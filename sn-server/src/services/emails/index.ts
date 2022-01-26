import nodemailer from "nodemailer";
import { google } from "googleapis";
import { resetLinkMail } from "./sendResetLinkMail";
import { googleCredentials } from "../../config";
import { User } from "../../interfaces/user.interface";

class Mailer {
  async main() {
    // create reusable transporter object using the default SMTP transport

    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      googleCredentials.clientId,
      googleCredentials.clientSecret,
      "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
      refresh_token: googleCredentials.refresh_token,
    });
    const accessToken = oauth2Client.getAccessToken();
    const emailConf: any = {
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: googleCredentials.user,
        clientId: googleCredentials.clientId,
        clientSecret: googleCredentials.clientSecret,
        refreshToken: googleCredentials.refresh_token,
        accessToken: accessToken,
        accessUrl: "https://oauth2.googleapis.com/token",
      },
    };
    return nodemailer.createTransport(emailConf);
  }

  async sendResetLink(emailAddress: string, user: User) {
    this.main()
      .then(async (transporter) => {
        // send mail with defined transport object
        let info = await transporter.sendMail(
          resetLinkMail(emailAddress, user)
        );

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      })
      .catch(console.error);
  }
}

export const mailer = new Mailer();
