import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import RegularUser from "../ProfileModel/RegularUser.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465 ? true : false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendProfileEmailVerification = async ({ uniqueId, email }) => {
  try {
    const token = jwt.sign({ uniqueId }, process.env.JWT_SECRET_VALUE, {
      expiresIn: "1h",
    });

    const saveVerifyToken = await RegularUser.findOneAndUpdate(
      { uniqueId },
      {
        $set: {
          verifyToken: token,
          verifyTokenExpiry: new Date(Date.now() + 6000),
        },
      },
      { new: true }
    );

    if (!saveVerifyToken) {
      return { message: "User not found." };
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      html: `
        <p>Click the following link to verify your email:</p>
        <a href="${process.env.FRONTEND_URL}/verify-email/${token}" target="_blank">Verify</a>
        <p>This link expires in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { message: "Verification email sent. Check your inbox." };
  } catch (err) {
    console.error("Error in sendEmailVerification:", err);
    return { success: false, message: "Internal server error." };
  }
};

export const sendProfileResetEmail = async (user, res) => {
  try {
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET_VALUE,
      { expiresIn: "1h" }
    );

    await RegularUser.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          resetToken: token,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      },
      { new: true }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password (valid for 1 hour):</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error sending password reset email." });
  }
};

export const sendSwitchingEmail = async (user, res) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/profile/switch/professional/confirm/${user?.professionalToken}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Switch To Professional",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password (valid for 1 hour):</p>
        <a href="${resetUrl}">Switch</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const SendProfileDeletionMail = async (user, token, res) => {
  try {
    const deletionUrl = `${process.env.FRONTEND_URL}/profile/delete/account/${token}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Switch To Professional",
      html: `
        <p>You requested a Delete Account.</p>
        <p>Click the link below to Delete your Account (valid for 1 hour):</p>
        <a href="${deletionUrl}">Switch</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
