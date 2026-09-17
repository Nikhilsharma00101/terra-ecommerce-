import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Please provide an email address.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Security best practice: Always return a generic success message even if the user doesn't exist.
      // This prevents email enumeration attacks.
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate a secure, random hex token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token using SHA-256 for secure storage in the DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration time to 15 minutes from now
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save hashed token and expiry to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // The secure reset URL that will be sent to the user (contains the UNHASHED token)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${req.headers.get('host') || 'localhost:3000'}`;
    const resetUrl = `${siteUrl}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 465,
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER || 'Info@terramensco.com',
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Info@terramensco.com',
      to: user.email,
      subject: 'Terra Men\'s Co - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DDD8CF; background-color: #FBF9F5;">
          <h2 style="color: #181817; text-align: center;">Reset Your Password</h2>
          <p style="color: #181817;">You requested a password reset for your Terra Men's Co account. Click the button below to reset your password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #181817; color: #F6F3ED; padding: 12px 24px; text-decoration: none; font-weight: bold; display: inline-block; letter-spacing: 1px; text-transform: uppercase; font-size: 12px;">Reset Password</a>
          </div>
          <p style="color: #57534E; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <p style="color: #57534E; font-size: 14px;">This link will expire in 15 minutes.</p>
          <hr style="border: none; border-top: 1px solid #DDD8CF; margin: 30px 0;" />
          <p style="color: #8C887B; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Terra Men's Co.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
