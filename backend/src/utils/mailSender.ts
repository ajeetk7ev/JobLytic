import sgMail from '@sendgrid/mail'


interface SendEmailOptions {
  to: string;
  subject: string;
  html: any;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const mailOptions = {
      from: "ajeetk8568@gmail.com", 
      to,
      subject,
      html,
    };
    const info = await sgMail.send(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

