"use client";

import OrganizationCard from "@/components/cards/OrganizationCard";
import Navbar from "@/components/shared/NavBar";
import BlurFade from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  createOrganization,
  getOrganizations,
  joinOrganization,
} from "@/lib/actions/organization.actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type Organization = {
  _id: string;
  name: string;
  description: string;
  code: string;
  members: string[];
  owner: string;
};

const MyOrganizationsPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState<string>("name");
  const orgsPerPage = 6;
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOrganizations();
        const sortedOrgs = sortOrganizations(res, sortCriteria);
        setOrganizations(sortedOrgs);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Error fetching organizations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [sortCriteria, organizations.length]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const createOrgAction = async (formData: FormData) => {
    const res = await createOrganization(formData);
    if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Successfully created organization with code ${res}`,
      });
    }
  };

  const joinOrgAction = async (formData: FormData) => {
    const formCode = formData.get("code") as string;
    const res = await joinOrganization(formCode.trim());
    if (res.error) {
      toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Successfully joined ${res}`,
      });
    }
  };
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const [joinDialog, setJoinDialog] = useState<boolean>(false);

  const sortOrganizations = (
    organizationsToSort: Organization[],
    criteria: string
  ) => {
    return [...organizationsToSort].sort((a: Organization, b: Organization) => {
      if (criteria === "name") {
        return a.name.localeCompare(b.name);
      } else if (criteria === "owner") {
        return a.owner.localeCompare(b.owner);
      }
      return 0;
    });
  };

  const indexOfLastOrg = currentPage * orgsPerPage;
  const indexOfFirstOrg = indexOfLastOrg - orgsPerPage;
  const currentOrgs = organizations.slice(indexOfFirstOrg, indexOfLastOrg);
  const totalPages = Math.ceil(organizations.length / orgsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }
  if (!session || status !== "authenticated") {
    return null;
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-fit gap-10 p-10">
        {organizations.length === 0 ? (
          <div className="flex flex-row gap-5 sm:mt-28 items-center w-full mt-20">
            <h1 className="text-xl ml-10 font-semibold">
              It's too quiet in here...
            </h1>
            <div className="flex flex-row items-center justify-center gap-5 h-fit w-fit">
              <BlurFade duration={2}>
                <Button variant="outline" onClick={() => setCreateDialog(true)}>
                  Create Organization
                </Button>
              </BlurFade>
              <BlurFade duration={2}>
                <Button variant="outline" onClick={() => setJoinDialog(true)}>
                  Join Organization
                </Button>
              </BlurFade>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mt-20">
              <h1 className="sm:text-4xl sm:font-bold text-md font-semibold">
                {session.user.name}, here are your organizations:
              </h1>
              <div className="flex flex-row items-center justify-center gap-5 h-fit w-fit">
                <BlurFade duration={2}>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialog(true)}
                  >
                    Create Organization
                  </Button>
                </BlurFade>
                <BlurFade duration={2}>
                  <Button variant="outline" onClick={() => setJoinDialog(true)}>
                    Join Organization
                  </Button>
                </BlurFade>
              </div>
              <div className="flex flex-row gap-3 items-center justify-center">
                <h2 className="sm:text-lg sm:block hidden font-semibold">
                  Sort by:
                </h2>
                <h2 className="text-sm sm:hidden block font-semibold">Sort:</h2>
                <Select
                  value={sortCriteria}
                  onValueChange={(value: string) => {
                    setSortCriteria(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px] sm:w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 lg:gap-0 grid-rows gap-10">
              {currentOrgs.map((org) => (
                <OrganizationCard
                  key={org._id}
                  name={org.name}
                  description={org.description}
                  code={org.code}
                  members={org.members}
                  ownerId={JSON.stringify(org.owner).toString()}
                  index={organizations.indexOf(org)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        currentPage > 1 && handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        currentPage < totalPages &&
                          handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      <Dialog open={joinDialog} onOpenChange={setJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Organization</DialogTitle>
            <DialogDescription>
              Enter the join code to join an organization and start
              collaborating with your team.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" action={joinOrgAction}>
            <div className="grid w-full max-w-sm items-center gap-2 mb-3">
              <Label htmlFor="email">Code</Label>
              <Input
                type="text"
                id="code"
                name="code"
                placeholder="Organization Code"
                required
              />
            </div>
            <div className="flex justify-between">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Join Organization</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to start collaborating with your team.
              Share the join code to let them join in on the fun!
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" action={createOrgAction}>
            <div className="flex flex-col gap-6">
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Organization Name"
                  required
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Organization Description"
                  required
                />
              </div>
              <div className="flex justify-between">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">Create Organization</Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrganizationsPage;
