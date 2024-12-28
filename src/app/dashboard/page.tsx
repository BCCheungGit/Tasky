"use client";
import { useState, useEffect } from "react";
// import TaskCard from "@/components/cards/TaskCard";
import Navbar from "@/components/shared/NavBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllTasks } from "@/lib/actions/task.actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DataTable } from "@/components/tasks/data-table";
import { columns } from "@/components/tasks/columns";
import { getUserById } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { getOrganizationById } from "@/lib/actions/organization.actions";

type Task = {
  _id: string;
  title: string;
  description: string;
  owner: string;
  viewable: string[];
  createdAt: Date;
  dueDate: Date;
  priority: string;
  completed: boolean;
  organization: string;
};


type Columns = {
  _id: string;
  title: string;
  description: string;
  owner: string;
  viewable: string[];
  createdAt: Date;
  dueDate: Date;
  priority: string;
  status: string;
  organization: string;
  isOwner: boolean;
}

const TaskPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [taskColumn, setTaskColumn] = useState<Columns[]>([]);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allTasks = await getAllTasks();

        const parsedTasks = await Promise.all(allTasks.map(async (task: Task) =>{ 
          
         let ownerName = await getUserById(task.owner);
         let orgName = await getOrganizationById(task.organization); 
         
         return {
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: new Date(task.dueDate),
          status: task.completed ? "Complete" : "Incomplete",
          isOwner: task.owner === session?.user?.id,
          owner: ownerName,
          organization: orgName
        }}))

        setTaskColumn(parsedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex mt-20 ml-10 mr-10">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks, good luck! 
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild >
              <Link href="/create-task">Create New <PlusIcon /></Link>
            </Button>
          </div>
        </div>
        <DataTable data={taskColumn} columns={columns} />
      </div>
    </div>
  )



}














// const Dashboard = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [sortCriteria, setSortCriteria] = useState<string>("dueDate");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);

//   const tasksPerPage = 6;

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//     }
//   }, [status, router]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const allTasks = await getAllTasks();

//         const parsedTasks = allTasks.map((task: Task) => ({
//           ...task,
//           createdAt: new Date(task.createdAt),
//           dueDate: new Date(task.dueDate),
//         }));

//         const sortedTasks = sortTasks(parsedTasks, sortCriteria);
//         setTasks(sortedTasks);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [sortCriteria]);



//   const sortTasks = (tasksToSort: Task[], criteria: string) => {
//     return [...tasksToSort].sort((a: Task, b: Task) => {
//       if (criteria === "priority") {
//         const priorityOrder = { high: 3, medium: 2, low: 1 };
//         return (
//           priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder] -
//           priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder]
//         );
//       } else if (criteria === "dueDate") {
//         return a.dueDate.getTime() - b.dueDate.getTime();
//       }
//       return 0;
//     });
//   };

//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
//   const totalPages = Math.ceil(tasks.length / tasksPerPage);

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const renderPaginationItems = () => {
//     const items = [];
//     for (let i = 1; i <= totalPages; i++) {
//       items.push(
//         <PaginationItem key={i}>
//           <PaginationLink
//             href="#"
//             isActive={currentPage === i}
//             onClick={(e) => {
//               e.preventDefault();
//               handlePageChange(i);
//             }}
//           >
//             {i}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }
//     return items;
//   };

//   if (status === "loading" || isLoading) {
//     return (
//       <div className="flex flex-col h-screen items-center justify-center">
//         <h1>Loading...</h1>
//       </div>
//     );
//   }

//   if (!session || status !== "authenticated") {
//     return null;
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="flex flex-col h-fit gap-10 p-10">
//         {tasks.length === 0 ? (
//           <div>
//             <h1 className="text-xl sm:mt-28 ml-10 font-semibold mt-20">
//               Nothing to do right now...
//             </h1>
//           </div>
//         ) : (
//           <>
//             <div className="flex justify-between items-center mt-20">
//               <h1 className="sm:text-4xl sm:font-bold text-md font-semibold">
//                 {session.user.name}, here are your tasks:
//               </h1>
//               <div className="flex flex-row gap-3 items-center justify-center">
//                 <h2 className="sm:text-lg sm:block hidden font-semibold">
//                   Sort by:
//                 </h2>
//                 <h2 className="text-sm sm:hidden block font-semibold">
//                   Sort:
//                 </h2>
//                 <Select
//                   value={sortCriteria}
//                   onValueChange={(value: string) => {
//                     setSortCriteria(value);
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <SelectTrigger className="w-[100px] sm:w-[180px]">
//                     <SelectValue placeholder="Sort By" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="dueDate">Due Date</SelectItem>
//                     <SelectItem value="priority">Priority</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid md:grid-cols-3 md:gap-0 grid-rows gap-10">
//               {currentTasks.map((task) => (
//                 <TaskCard
//                   key={task._id}
//                   title={task.title}
//                   description={task.description}
//                   dueDate={task.dueDate}
//                   priority={task.priority}
//                   id={task._id}
//                   ownerId={JSON.stringify(task.owner).toString()}
//                   index={tasks.indexOf(task)}
//                   createdOn={task.createdAt}
//                   organizationId={task.organization}
//                   completed={task.completed}
//                 />
//               ))}
//             </div>
//             {totalPages > 1 && (
//               <Pagination className="">
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       href="#"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         currentPage > 1 && handlePageChange(currentPage - 1);
//                       }}
//                     />
//                   </PaginationItem>

//                   {renderPaginationItems()}

//                   <PaginationItem>
//                     <PaginationNext
//                       href="#"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         currentPage < totalPages &&
//                           handlePageChange(currentPage + 1);
//                       }}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
export default TaskPage;