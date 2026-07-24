import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { connectDB } from '../config/db';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const username = process.env.ADMIN_USERNAME || 'nexorae-admin';
    const email = process.env.ADMIN_EMAIL || 'admin@nexorae.in';
    const password = process.env.ADMIN_PASSWORD || 'NexoraeAdmin@2026';

    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      console.log(`Admin with username '${username}' or email '${email}' already exists.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = new Admin({
      username,
      email,
      passwordHash,
      role: 'admin',
    });

    await admin.save();
    console.log(`Admin created successfully!`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
