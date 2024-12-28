import Link from "next/link";
import BlurFade from "../ui/blur-fade";
import { Button } from "../ui/button";
import { ReviewMarquee } from "./Marquee";
import { ArrowUp } from "lucide-react";
import { useSession } from "next-auth/react";

const Hero = () => {
  const { data: session, status } = useSession();
  return (
    <>
      <section id="hero"></section>
      <section className="w-full h-full flex flex-col mt-20 p-10">
        <div className="flex w-full justify-center items-center">
          <BlurFade duration={1} inView>
            <h1 className="sm:text-4xl text-2xl font-bold p-2  ">
              See What Others are Saying
            </h1>
          </BlurFade>
        </div>
        <ReviewMarquee />
        <div className="flex items-center justify-center w-full h-full gap-8">
          <Button asChild variant="outline" className="w-fit">
            <a
              href="/#"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top <ArrowUp />
            </a>
          </Button>
          <Button asChild>
            <Link href={status == "authenticated" ? '/dashboard' : '/sign-up'}>
            Get Started
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Hero;
