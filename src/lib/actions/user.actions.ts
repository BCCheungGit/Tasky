"use server";
import { connectToDB } from "@/lib/mongoose";
import User from "../models/user.model";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";


export async function signUp(formData: FormData) {
    const username = formData.get('username')?.toString().trim();
    const password = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (password !== confirm) {
        return {
            error: "Passwords do not match"
        }
    }
    await connectToDB();
    const userFound = await User.findOne({ username });
    if (userFound) {
        return {
            error: "Username already exists"
        }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        password: hashedPassword
    })
    await user.save();

    return { success: true };
};



export async function getUserByUsername(username: string) {
    await connectToDB();
    
    const user = await User.findOne({username: {$eq: username}});
    if (!user) {
        return { error: "User not found"};
    }
    return user;
}

export async function getUserById(id: string) {
    console.log(id.replace(/"/g, ''));
    const parsedId = id.replace(/"/g, '');
    await connectToDB();
    const user = await User.findById(parsedId);
    if (!user) {
        return { error: "User not found"};
    }
    return user.username;
}