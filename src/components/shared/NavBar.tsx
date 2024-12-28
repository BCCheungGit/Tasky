"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { UserNav } from "./UserNav";
const Navbar = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [active, setActive] = useState<string>("");
  const { data: session, status } = useSession();
  return (
    <nav className="sm:px-16 bg-background px-6 w-full flex items-center py-3 fixed top-0 z-20 border-b-2">
      <div className="w-full flex justify-between items-center mx-auto">
        <a
          href="/#"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img
            src="/logo.svg"
            alt="logo"
            className="sm:w-14 sm:h-14 w-9 h-9 object-contain"
          />
          <p className="text-white text-[19px] sm:text-[22px] font-bold cursor-pointer flex">
            TASKY
          </p>
        </a>
        <ul className="list-none flex flex-row gap-10">
          {status === "loading" ? (
            <Button variant="outline" disabled>
              ...Loading
            </Button>
          ) : session ? (
            <div className="flex flex-row gap-5">
 
              <UserNav username={session.user.name} />
            </div>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </ul>

        
      </div>
    </nav>
  );
};

export default Navbar;
