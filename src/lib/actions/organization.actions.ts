"use server";

import { connectToDB } from "../mongoose";
import Organization from "../models/organization.model";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

export async function createOrganization(formData: FormData) {
    await connectToDB();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;
    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    try {
        const newOrg = new Organization({
            name,
            description,
            code,
            members: [current_userid],
            owner: current_userid,
        })
        await newOrg.save();
        return newOrg.code;
    } catch (error: any) {
        return { error: error.message };
    }

}


export async function joinOrganization(code: string) {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;

    const org = await Organization.findOne({ code: { $eq: code } });
    if (!org) {
        return { error: "Organization not found" };
    }
    if (org.members.includes(current_userid)) {
        return { error: "Already a member" };
    }
    org.members.push(current_userid);
    await org.save();
    return org.name;
}




export async function leaveOrganization(code: string) {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;
    console.log(current_userid);
    const org = await Organization.findOne({ code: { $eq: code } });
    if (!org) {
        return { error: "Organization not found" };
    }
    if (!org.members.includes(current_userid)) {
        return { error: "Not a member" };
    }
    if (org.owner == current_userid && org.members.length > 1) {
        return { error: "Owner cannot leave organization while there are still members" };
    }
    if (org.owner != current_userid) {
        await Organization.updateOne(
            { _id: org._id },
            { $pull: { members: current_userid } }
        );
    } else {
        await Organization.deleteOne({ _id: org._id });
    }


    return { success: `Left organization ${org.name}` };
}


export async function getOrganizations() {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;
    const orgs = await Organization.find({ members: current_userid });
    return JSON.parse(JSON.stringify(orgs));
}


export async function getOwnedOrganizations() {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;
    const orgs = await Organization.find({ owner: current_userid });
    return JSON.parse(JSON.stringify(orgs));
}

export async function checkOwnership(orgId: string, userId: string) {
    await connectToDB();
    const org = await Organization.findById(orgId);
    if (!org) {
        return { error: "Organization not found" };
    }
    return org.owner == userId;
}


export async function checkMembership(orgId: string, userId: string) {
    await connectToDB();
    const org = await Organization.findById(orgId);
    if (!org) {
        return { error: "Organization not found" };
    }
    return org.members.includes(userId);
}



export async function getOrganizationById(orgId: string) {
    await connectToDB();
    if (!orgId) {
        return "Personal";
    } 
    const org = await Organization.findById(orgId);
    if (!org) {
        return { error: "Organization not found" };
    } 
    return org.name;
}