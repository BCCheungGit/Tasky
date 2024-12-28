// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Checkbox } from "../ui/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

// import { getUserById } from "@/lib/actions/user.actions";
// import { Button } from "../ui/button";
// import { motion } from "framer-motion";
// import { CalendarDays, TriangleAlert } from "lucide-react";
// import { completeTask, deleteTask } from "@/lib/actions/task.actions";
// import { useToast } from "@/hooks/use-toast";
// import { Label } from "@radix-ui/react-label";
// import { useSession } from "next-auth/react";

// interface TaskCardProps {
//   title: string;
//   description: string;
//   dueDate: Date;
//   priority: string;
//   id: string;
//   ownerId: string;
//   index: number;
//   createdOn: Date;
//   organizationId: string;
//   completed: boolean;
// }

// const TaskCard = (taskProps: TaskCardProps) => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isCompleteOpen, setIsCompleteOpen] = useState(false);
//   const isTruncated = taskProps.description.trim().length >= 55;
//   const isTitleTruncated = taskProps.title.trim().length >= 20;
//   const displayDescription = isTruncated
//     ? taskProps.description.substring(0, 55) + "..."
//     : taskProps.description;
//   const { toast } = useToast();

//   const displayTitle = isTitleTruncated 
//   ? taskProps.title.substring(0, 20) + "..."
//   : taskProps.title;

//   const completeAction = async () => {
//     try {
//       const res = await completeTask(taskProps.id);
//       if (res.error) {
//         toast({
//           title: "Error",
//           description: res.error,
//           variant: "destructive",
//         });
//       } else {
//         setIsCompleteOpen(false);
//         toast({
//           title: "Success",
//           description: "Task marked as complete",
//         });
//         location.reload();
//       }
//     } catch (error: any) {
//       console.log(error);
//     }
//   };

//   const deleteAction = async () => {
//     try {
//       const res = await deleteTask(taskProps.id);
//       if (res.error) {
//         toast({
//           title: "Error",
//           description: res.error,
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: "Success",
//           description: "Task deleted",
//         });
//         location.reload();
//       }
//     } catch (error: any) {
//       console.log(error);
//     }
//   }
    

//   const [ownerName, setOwnerName] = useState<string>("");
//   useEffect(() => {
//     async function fetchOwnerName() {
//       const res = await getUserById(taskProps.ownerId);
//       if (res.error) {
//         console.log(res.error);
//       } else {
//         setOwnerName(res);
//       }
//     }
//     fetchOwnerName();
//   }, []);

//   const checkOverdue = () => {
//     const currentDate = new Date();
//     return currentDate > taskProps.dueDate;
//   };

//   return (
//     <motion.div
//       key={`${taskProps.index}-${taskProps.dueDate}-${taskProps.priority}`}
//       variants={{
//         hidden: { x: -100, opacity: 0 },
//         show: {
//           x: 0,
//           opacity: 1,
//           transition: {
//             type: "tween",
//             delay: (taskProps.index % 6) * 0.25,
//             duration: 1.5,
//             ease: "easeOut",
//           },
//         },
//       }}
//       initial="hidden"
//       whileInView="show"
//       viewport={{ once: true, amount: 0.25 }}
//       className="md:w-[500px] md:h-[300px] h-full w-full"
//     >
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold w-full items-center justify-center flex flex-row gap-6">
//             {displayTitle}{" "}
//             {checkOverdue() && (
//               <HoverCard>
//                 <HoverCardTrigger asChild>
//                   <TriangleAlert className="text-red-500 cursor-pointer" />
//                 </HoverCardTrigger>
//                 <HoverCardContent className="w-80">
//                   <div className="flex flex-col gap-2">
//                     <h4 className="text-sm font-semibold flex flex-row items-center">
//                       <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
//                       Task Overdue
//                     </h4>
//                     <p className="text-sm">
//                       This task has passed its due date of{" "}
//                       {taskProps.dueDate.toLocaleString()}
//                     </p>
//                   </div>
//                 </HoverCardContent>
//               </HoverCard>
//             )}
//           </CardTitle>
//           <CardDescription
//             className="text-center cursor-pointer"
//             onClick={() => setIsDialogOpen(true)}
//           >
//             {displayDescription}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid w-full items-center ">
//             <div>
//               <p>Due Date: {taskProps.dueDate.toLocaleString()}</p>
//             </div>
//             <div>
//               <p>Priority: {taskProps.priority}</p>
//             </div>
//             <div className="cursor-pointer">
//               <p
//                 className="text-slate-200"
//                 onClick={() => {
//                   setIsDialogOpen(true);
//                 }}
//               >
//                 ...
//               </p>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between items-center">
//           {taskProps.completed ? (
//             <>
//               <div className="flex flex-row space-x-2 items-center">
//                 <Checkbox checked disabled />
//                 <p>Completed</p>
//               </div>
//               <form action={deleteAction}>
//                 <Button type="submit" variant="destructive">Delete</Button>
//               </form>
//             </>
//           ) : (
//             <div className="flex items-center space-x-2">
//               <Button variant="outline" onClick={() => setIsCompleteOpen(true)}>
//                 Mark as Complete
//               </Button>
//             </div>
//           )}
//         </CardFooter>
//       </Card>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{taskProps.title}</DialogTitle>
//             <DialogDescription>{taskProps.description}</DialogDescription>
//           </DialogHeader>
//           <div className="flex flex-col flex-wrap gap-4">
//             <p className="text-sm">
//               Due Date: {taskProps.dueDate.toLocaleString()}
//             </p>
//             <p className="text-sm">
//               Created On: {taskProps.createdOn.toLocaleString()}
//             </p>
//             <p className="text-sm">Priority: {taskProps.priority}</p>
//             <p className="text-sm">Assigned By: {ownerName}</p>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Are you sure?</DialogTitle>
//             <DialogDescription>
//               This will mark the task as complete, and it will no longer be
//               viewable to you. This action cannot be undone
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <form action={completeAction}>
//               <Button type="submit">Confirm</Button>
//             </form>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </motion.div>
//   );
// };

// export default TaskCard;
