"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "../components/shared/NavBar";

import { AnimatedBeamTasky } from "@/components/home/AnimatedBeam";
import WordFadeIn from "@/components/ui/word-fade-in";
import BlurIn from "@/components/ui/blur-in";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlurFade from "@/components/ui/blur-fade";
import Hero from "@/components/home/Hero";
import BottomBar from "@/components/home/BottomBar";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import OrganizationsAbout from "@/components/home/OrganizationsAbout";
import TasksAbout from "@/components/home/TasksAbout";
function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        {status === "loading" ? (
          <h1 className="text-4xl font-bold text-center">...Loading</h1>
        ) : (
          <div className="flex sm:flex-row flex-col sm:gap-10 gap-0 items-center justify-center w-full h-full p-4">
            <div className="flex flex-col items-center sm:gap-0 gap-5 justify-center w-full sm:h-full">
              <BlurIn
                word="Welcome to Tasky!"
                className="sm:text-6xl text-3xl font-bold text-center"
              />
              <WordFadeIn className="sm:inline hidden" delay={0.3} words="The best way to project manage." />
              {status === "unauthenticated" ? (
                <div className="flex flex-row items-center justify-center gap-5 h-fit w-fit">
                  <BlurIn
                    word="Sign in to get started."
                    className="sm:text-md text-center"
                    duration={2}
                  />
                  <BlurFade duration={2}>
                    <Button asChild variant="outline">
                      <Link href="#tasksabout">Learn More</Link>
                    </Button>
                  </BlurFade>
                </div>
              ) : (
                <div className="flex flex-row items-center justify-center gap-5 h-fit w-fit">
                  <BlurIn
                    word="Welcome back!"
                    className="text-md text-center sm:block hidden"
                    duration={2}
                  />
                  <BlurFade duration={2}>
                    <Button asChild variant="outline">
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </BlurFade>
                  <BlurFade duration={2}>
                    <Button asChild variant="outline">
                      <Link href="#tasksabout">Learn More</Link>
                    </Button>
                  </BlurFade>
                </div>
              )}
            </div>
            <AnimatedBeamTasky />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Main() {
  return (
    <div className="relative z-0 bg-background ">

      <div className="bg-background bg-cover bg-no-repeat bg-center">

        <NavBar />
        <Home />
        <TasksAbout />
        <OrganizationsAbout />
        <Hero />

        <BottomBar />
      </div>
    </div>
  );
}
