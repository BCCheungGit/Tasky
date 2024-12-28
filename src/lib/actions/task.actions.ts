"use server";


import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import Task from "../models/task.model";
import { connectToDB } from "@/lib/mongoose"
import { getUserByUsername } from "./user.actions";
import Organization from "../models/organization.model";
import { checkMembership, checkOwnership } from "./organization.actions";
import { revalidatePath } from "next/cache";

export async function getAllTasks() {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;
       const tasks = await Task.find({
        $or: [
            { $and: [{viewable: current_userid }, {completed: false}] },
            { $and: [{completed: true}, {owner: current_userid}] },
            { owner: current_userid }
        ],
    });

    return JSON.parse(JSON.stringify(tasks));
}



interface TaskData {
    title: string;
    description: string;
    dueDate: Date;
    sharedWith: string[];
    priority: string;
    orgId: string;
}

export async function createTask(taskData: TaskData) {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;

    if (taskData.orgId !== "Personal" && current_userid) {
       const isOwner = await checkOwnership(taskData.orgId, current_userid);
       if (!isOwner) {
           return { error: "Not authorized to create task in this organization"};
       } 
    } 
    let shared = [];
    if (taskData.orgId === "Personal") {
        shared = [current_userid];
    } else { 
    for (let i = 0; i < taskData.sharedWith.length; i++) {
        const user = await getUserByUsername(taskData.sharedWith[i]);
        if (user.error) {
            return { error: "User not found"};
        }
        const isMember = await checkMembership(taskData.orgId, user._id);
        if (isMember.error || !isMember) {
            return { error: "User is not a member of the organization"};
        }
        shared.push(user._id);
    }
    }



    const task = new Task({
        owner: current_userid,
        viewable: [current_userid, ...shared],
        title: taskData.title,
        description: taskData.description,
        createdAt: new Date(),
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        organization: taskData.orgId === "Personal" ? null : taskData.orgId,
        completed: false 
    });
    try {
        await task.save();
        console.log("Created a new task!");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}




export async function deleteTask(id: string) {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;
    const task = await Task.findById(id);
    if (!task) {
        return { error: "Task not found"};
    }
    if (task.owner.toString() !== current_userid) {
        return { error: "Not authorized to delete this task"};
    }

    await Task.findByIdAndDelete(id);
    return { success: true };
}




export async function completeTask(id: string) {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const current_userid = session?.user.id;
    const task = await Task.findById(id);
    if (!task) {
        return { error: "Task not found"};
    }
    if (!task.viewable.includes(current_userid)) {
        return { error: "Not authorized to complete this task"};
    }
    task.completed = true;
    await task.save();
    revalidatePath("/dashboard");
    return { success: true };  
}