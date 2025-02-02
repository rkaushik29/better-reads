import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import BookSearchWithTag from "./BookSearchWithTag";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BookSearchDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BookSearchDialog: React.FC<BookSearchDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button icon={<Search color="white" />}>Search | Cmd+K</Button>
      </DialogTrigger>
      <DialogContent className="w-1/3">
        <BookSearchWithTag />
      </DialogContent>
    </Dialog>
  );
};

export default BookSearchDialog;
