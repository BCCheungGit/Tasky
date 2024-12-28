import { Copyright } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
const BottomBar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <nav className="bg-background  py-20 px-6 w-full lg:flex hidden items-center justify-center bottom-0 z-20 border-t-2">
        <div className="w-full flex justify-center items-center">
          <div className="mr-80 flex flex-row items-center justify-center gap-1 text-[12px]">
            <Copyright size={16} />
            Tasky. All rights reserved.
          </div>
          <ul className="list-none hidden sm:flex flex-row gap-10">
            <li
              className="text-white text-[12px] cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              Privacy Policy
            </li>
            <li
              className="text-white text-[12px] cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              Terms of Service
            </li>
            <li
              className="text-white text-[12px] cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              Contact Us
            </li>
          </ul>
        </div>
      </nav>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erm...</DialogTitle>
            <DialogDescription>
              This link doesn't actually do anything... whoops!
            </DialogDescription>
          </DialogHeader>
        <DialogFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogFooter>
        </DialogContent>

      </Dialog>
    </>
  );
};

export default BottomBar;
