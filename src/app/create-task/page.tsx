"use client";

import Navbar from "@/components/shared/NavBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createTask } from "@/lib/actions/task.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CircleHelp } from "lucide-react";
import { useSession } from "next-auth/react";
import { getOrganizations, getOwnedOrganizations } from "@/lib/actions/organization.actions";
import { motion } from "framer-motion";
type Organization = {
  _id: string;
  name: string;
  description: string;
  code: string;
  members: string[];
  owner: string;
};

const CreateTaskPage = () => {
  const [date, setDate] = useState<Date>();
  const [priority, setPriority] = useState<string>();
  const [currOrg, setCurrOrg] = useState<string>();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrgs = async () => {
      const res = await getOwnedOrganizations();
      console.log(res);
      setOrganizations(res);
    };
    fetchOrgs();
  }, []);

  const formAction = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const viewable = formData.get("viewable") as string;
    let sharedWith = viewable
      ? viewable.split(",").map((item) => item.trim())
      : [];

    // Validate date
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a due date.",
        variant: "destructive",
      });
      return;
    }

    // Prepare task data
    const taskData = {
      title,
      description,
      dueDate: date,
      sharedWith,
      priority: priority || "low",
      orgId: currOrg || "Personal",
    };

    // Call createTask server action
    try {
      const result = await createTask(taskData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Task created successfully",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create task",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the task",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-w-screen min-h-screen flex flex-col justify-center items-center h-full">
      <Navbar />
      <motion.div
      variants={{
        hidden: { x: -100, opacity: 0 },
        show: {
          x: 0,
          opacity: 1,
          transition: {
            type: "tween",
            delay: 0.25,
            duration: 1.5,
            ease: "easeOut",
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }} 
      className="w-full flex flex-row justify-center items-center h-full mt-20">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Task</CardTitle>
            <CardDescription>
              Create and/or assign a new task to someone!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-2" action={formAction}>
              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Task Name"
                    required
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Task Description"
                    required
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Label
                        htmlFor="organization"
                        className="flex flex-row items-center gap-1"
                      >
                        Organization
                        <CircleHelp size={16} />{" "}
                      </Label>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-sm font-semibold flex flex-row items-center">
                          Organization
                        </h4>
                        <p className="text-sm">
                          You can only assign tasks to members of this
                          organization, and you must be the owner of the
                          organization.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <Select
                    value={currOrg}
                    onValueChange={(value) => setCurrOrg(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal">Personal</SelectItem>
                      {organizations.map((org) => (
                        <SelectItem key={org._id} value={org._id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  {currOrg === "Personal" ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex flex-row items-center gap-2">
                          <Label htmlFor="viewable" className="text-secondary">
                            Assign To
                          </Label>
                          <CircleHelp size={16} />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sm font-semibold flex flex-row items-center">
                            Assign To
                          </h4>
                          <p className="text-sm">
                            Enter the usernames as a comma-separated list.
                            Example: user1,user2,user3 
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex flex-row items-center gap-2">
                          <Label htmlFor="viewable">Assign To</Label>
                          <CircleHelp size={16} />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sm font-semibold flex flex-row items-center">
                            Assign To
                          </h4>
                          <p className="text-sm">
                            Enter the usernames as a comma-separated list.
                            Example: user1,user2,user3 
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                  <Input
                    type="text"
                    id="viewable"
                    name="viewable"
                    placeholder="e.g user1,user2"
                    disabled={currOrg === "Personal"}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="date">Due Date</Label>
                  <DateTimePicker
                    value={date}
                    granularity="minute"
                    onChange={(value) => setDate(value)}
                    className="w-[280px]"
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="viewable">Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(value) => setPriority(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit">Create Task</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateTaskPage;
