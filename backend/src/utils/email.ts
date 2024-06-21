import nodemailer from 'nodemailer';

const emailVerifyEmailTemplate = `
Hi [User],

To complete your registration, please click the link below to verify your email:

[Verification Link]

Thanks,
Camagru
`

const emailResetPasswordTemplate = `
Hi [User],

You have requested to reset your password. Please click the link below to set a new password:

[Verification Link]

If you did not request a password reset, please ignore this email or contact support if you have any questions.

Thanks,
Camagru
`

export const sendEmail = async (
    email: string,
    username: string,
    subject: string,
    verificationLink: string
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        let emailTemplate = '';

        if (subject === 'Password reset') {
            emailTemplate = emailResetPasswordTemplate;
        } else if (subject === 'Verify Your Account') {
            emailTemplate = emailVerifyEmailTemplate;
        }

        await transporter.sendMail({
            from: `"Camagru" <${process.env.USER}>`,
            to: email,
            subject,
            text: emailTemplate.replace('[User]', username).replace('[Verification Link]', verificationLink)
        })

        console.log('Email sent successfully')
    } catch (error) {
        console.log(error)
    }
}
