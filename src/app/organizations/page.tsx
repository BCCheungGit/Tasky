"use client";

import Navbar from "@/components/shared/NavBar";

import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import BlurIn from "@/components/ui/blur-in";
import WordFadeIn from "@/components/ui/word-fade-in";
import BlurFade from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  createOrganization,
  joinOrganization,
} from "@/lib/actions/organization.actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Target, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const OrganizationsPage = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
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
      })
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
      })
    } else {
      toast({
        title: "Success",
        description: `Successfully joined ${res}`,
      });
    }
  };
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const [joinDialog, setJoinDialog] = useState<boolean>(false);
  const slides = [
    {
      icon: <Users className="w-12 h-12 text-indigo-400" />,
      title: "Team Collaboration",
      description:
        "Connect and work together with your team members efficiently",
    },
    {
      icon: <Target className="w-12 h-12 text-indigo-400" />,
      title: "Track Goals",
      description: "Set and monitor team objectives and key results",
    },
    {
      icon: <Calendar className="w-12 h-12 text-indigo-400" />,
      title: "Task Timeline",
      description: "Visualize project progress and upcoming deadlines",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-indigo-400" />,
      title: "Improve Performance",
      description: "Monitor team productivity and increase performance",
    },
  ];
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex sm:flex-row flex-col sm:gap-36 gap-10 items-center justify-center w-full h-full p-4">
          <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="sm:w-1/3 w-[300px]"
        >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <div className="flex flex-col sm:gap-8 gap-2 items-center justify-center">
                          <span className="text-4xl font-semibold">
                            {slide.icon}
                          </span>
                          <div className="flex flex-col gap-2 items-center justify-center">
                            <span className="sm:text-3xl text-2xl font-semibold">
                              {slide.title}
                            </span>
                            <span className="sm:text-lg text-muted-foreground text-center text-md">
                                {slide.description}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex flex-col items-center sm:gap-0 gap-5 justify-center w-fit sm:h-full">
            <BlurIn
              word="Organizations"
              className="sm:text-6xl text-3xl font-bold text-center"
            />
            <WordFadeIn
              className="sm:inline hidden"
              delay={0.3}
              words="Interact with Team Members"
            />

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
        </div>
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

export default function OrganizationsHome() {
  return (
    <div className="relative z-0 bg-background">
      <div className="bg-background bg-cover bg-no-repeat bg-center">
        <Navbar />
        <OrganizationsPage />
      </div>
    </div>
  );
}
