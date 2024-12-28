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

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { DialogClose } from "@radix-ui/react-dialog";

import { ArrowDown, Calendar, Target, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
const OrganizationsAbout = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));

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
<>
    <section id="aboutorgs"></section>
      <section className="flex flex-col items-center justify-center h-full mt-20">
        <div className="flex sm:flex-row flex-col sm:gap-36 gap-10 items-center justify-center w-full h-full p-4">
          <Carousel
            plugins={[plugin.current]}
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
              word="Collaborate"
              className="sm:text-6xl text-3xl font-bold text-center"
            />
            <WordFadeIn
              className="sm:inline hidden"
              delay={0.3}
              words="with team members using Organizations"
            />
            <Button asChild variant="outline"><Link href="#hero"><ArrowDown /></Link></Button> 
          </div>
        </div>
      </section>
</>
   

  );
};


export default OrganizationsAbout;