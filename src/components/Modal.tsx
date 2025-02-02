import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ModalProps = {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
};

export const Modal: FC<ModalProps> = ({
  title,
  description,
  children,
  trigger,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="flex justify-end">
          {primaryAction}
          {secondaryAction}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
