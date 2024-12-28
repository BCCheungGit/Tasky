import Image from "next/image";
import BlurIn from "../ui/blur-in";
import WordFadeIn from "../ui/word-fade-in";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Button } from "../ui/button";

const TasksAbout = () => {
  return (
    <>
      <section id="tasksabout"></section>
      <section className="flex flex-col items-center justify-center mt-20">
        <div className="flex sm:flex-row flex-col sm:gap-36 gap-10 items-center justify-center w-full h-full p-4">
          <div className="flex flex-col items-center sm:gap-0 gap-5 justify-center w-fit sm:h-full">
            <BlurIn
              word="Manage"
              className="sm:text-6xl text-3xl font-bold text-center"
            />
            <WordFadeIn
              className="sm:inline hidden"
              delay={0.3}
              words="your tasks with ease"
            
            />
            <Button asChild variant="outline"><Link href="#aboutorgs"><ArrowDown /></Link></Button> 
          </div>
          <Image
            src="/taskdemo.png"
            alt="tasksabout"
            className="lg:block hidden"
            width={800}
            height={800}
            unoptimized 
          />
          <Image
            src="/taskdemo.png"
            alt="tasksabout"
            className="lg:hidden block "
            width={400}
            height={400}
            unoptimized
            />
        </div>

      </section>
    </>
  );
};

export default TasksAbout;
