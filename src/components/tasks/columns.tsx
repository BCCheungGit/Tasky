"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "../ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
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
}

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


import { Row } from "@tanstack/react-table";

const prioritySort = (a: Row<Columns>, b: Row<Columns>) => {
  const value = (priority: string) => {
    if (priority === "low") return 0;
    if (priority === "medium") return 1;
    if (priority === "high") return 2;
    return -1; // Default case for invalid priority
  };

  const priorityA = value(a.original.priority);
  const priorityB = value(b.original.priority);
  console.log(priorityA, priorityB);

  // Sorting in ascending order: Low -> Medium -> High
  if (priorityA < priorityB) {
    return 1;
  }
  if (priorityA > priorityB) {
    return -1;
  }
  return 0; // If both priorities are equal
};
export const columns: ColumnDef<Columns>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: "ID",
    enableSorting: false,
    enableHiding: true,

  }, 
  {
    accessorKey: "owner",
    header: "Owner",
    enableSorting: true,
    enableHiding: true,

  },
  {
    accessorKey: "organization",
    header: "Organization",
    enableSorting: true,
    enableHiding: true,
  }, 
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    enableSorting: false,
    
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    enableSorting: true,
    sortingFn: prioritySort,
    
},
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
  }
]
