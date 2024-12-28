"use client";

import { getUserById } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { leaveOrganization } from "@/lib/actions/organization.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface OrganizationCardProps {
  name: string;
  description: string;
  code: string;
  members: string[];
  ownerId: string;
  index: number;
}
const OrganizationCard = (organizationProps: OrganizationCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const isTruncated = organizationProps.description.trim().length >= 55;
  const isTitleTruncated = organizationProps.name.trim().length >= 20; 
  const displayDescription = isTruncated
    ? organizationProps.description.substring(0, 55) + "..."
    : organizationProps.description;
  
  const displayTitle = isTitleTruncated 
  ? organizationProps.name.substring(0, 20) + "..."
  : organizationProps.name;

  const [ownerName, setOwnerName] = useState<string>("");
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchOwnerName() {
      const res = await getUserById(organizationProps.ownerId);
      if (res.error) {
        console.log(res.error);
      } else {
        setOwnerName(res);
      }
    }
    fetchOwnerName();
  }, []);

  useEffect(() => {
    async function fetchMemberNames() {
      const promises = organizationProps.members.map(async (member) => {
        const res = await getUserById(member);
        return res;
      });
      const memberNames = await Promise.all(promises);
      setMemberNames(memberNames);
    }
    fetchMemberNames();
  }, [organizationProps.members]);

  return (
    <motion.div
      key={`${organizationProps.name}-${organizationProps.code}-${organizationProps.ownerId}`}
      variants={{
        hidden: { x: 100, opacity: 0 },
        show: {
          x: 0,
          opacity: 1,
          transition: {
            type: "tween",
            delay: (organizationProps.index % 6) * 0.25,
            duration: 1.5,
            ease: "easeOut",
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="md:w-[500px] md:h-[300px] h-full w-full"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold w-full items-center justify-center flex flex-row gap-6">
            {displayTitle}
          </CardTitle>
          <CardDescription
            className="text-center cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            {displayDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="grid w-full items-center gap-4">
              <p>Owner: {ownerName}</p>
              <p>Members: {organizationProps.members.length}</p>
              <p>Code: {organizationProps.code}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={() => setIsDialogOpen(true)}>View Details</Button>

          <form
            action={async () => {
              const res = await leaveOrganization(organizationProps.code);
              if (res.error) {
                toast({
                  title: "Error",
                  description: res.error,
                  variant: "destructive",
                });
              } else {
                location.reload(); 
                toast({
                  title: "Success",
                  description:  res.success,
                });

              }
              console.log(res);
            }}
          >
            <Button type="submit" variant="destructive">
              Leave Organization
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{organizationProps.name}</DialogTitle>
            <DialogDescription>
              {organizationProps.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col flex-wrap gap-4">
            <Command>
              <CommandInput placeholder="Search for members..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Owner">
                  <CommandItem>{ownerName}</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Members">
                  {memberNames.map((member) => (
                    <CommandItem key={member}>{member}</CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrganizationCard;
