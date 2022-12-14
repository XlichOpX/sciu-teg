import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
export async function sendMail({
  from,
  to,
  subject,
  text,
  html,
  attachments
}: Partial<Mail.Options>) {
  /**
   * Esta sección hace uso de las variables de entorno.
   */
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  const transportObject: SMTPTransport.Options = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  }
  const transporter = nodemailer.createTransport({ ...transportObject })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments // attach files array
  })
  if (info.accepted.includes(to as string)) return true && info
  else throw new Error(`no delivered email from ${to}`)
}
