import React from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash, Check, Clock, Search } from "lucide-react";

import { BookCard } from "@/components/Card";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserBooksUpdate } from "@/drizzle/schema";

export interface LibraryBook {
  id: number;
  title: string;
  authors?: string | null;
  imageLinks?: string | null;
  status: string | null;
  printedPageCount: number | null;
  startDate?: string | null;
  endDate?: string | null;
  rating?: number | null;
}

interface LibraryBookCardProps {
  book: LibraryBook;
  onUpdate: (id: number, data: UserBooksUpdate) => void;
  onDelete: (id: number) => void;
}

const renderStatusIcon = (status: string) => {
  switch (status) {
    case "read":
      return <Check className="text-green-500" />;
    case "reading":
      return <Clock className="text-yellow-500" />;
    case "wantToRead":
      return <Search className="text-gray-500" />;
    default:
      return null;
  }
};

export function LibraryBookCard({ book, onUpdate, onDelete }: LibraryBookCardProps) {
  const { register, handleSubmit } = useForm();

  const handleUpdate = (data: UserBooksUpdate) => {
    const startDate = data.startDate ? new Date(data.startDate) : null;
    const endDate = data.endDate ? new Date(data.endDate) : null;

    onUpdate(book.id, {
      ...data,
      startDate: startDate instanceof Date ? startDate : undefined,
      endDate: endDate instanceof Date ? endDate : undefined,
      rating: Number(data.rating),
      status: data.status,
    });
  };

  const handleDeleteButton = () => {
    onDelete(book.id);
  };

  return (
    <BookCard title={book.title} description={book.authors ?? ""}>
      <div className="group flex flex-col items-center justify-center gap-2">
        <img
          src={book.imageLinks ?? ""}
          alt={book.title}
          className="h-48 w-full object-contain"
        />

        <div className="flex items-center">
          {book.status && renderStatusIcon(book.status)}
        </div>

        <div className="text-sm text-gray-500">{book.printedPageCount}</div>

        <div className="flex gap-2 p-2 group-hover:flex items-center">
          <Modal
            title={`Edit ${book.title}`}
            trigger={
              <div className="cursor-pointer">
                <Pencil className="h-4 w-4" />
              </div>
            }
          >
            <form onSubmit={handleSubmit(handleUpdate)}>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="wantToRead"
                      {...register("status")}
                      defaultChecked={book.status === "wantToRead"}
                    />
                    TBR
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="reading"
                      {...register("status")}
                      defaultChecked={book.status === "reading"}
                    />
                    Reading
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="read"
                      {...register("status")}
                      defaultChecked={book.status === "read"}
                    />
                    Read
                  </label>
                </div>
                <Input
                  type="date"
                  defaultValue={
                    book.startDate
                      ? new Date(book.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  {...register("startDate")}
                />
                <Input
                  type="date"
                  defaultValue={
                    book.endDate
                      ? new Date(book.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  {...register("endDate")}
                />
                <Input
                  type="number"
                  defaultValue={book.rating ?? 0}
                  {...register("rating")}
                  placeholder="Rating"
                  max={5}
                  min={0}
                />
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Modal>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteButton}
            className="text-red-500 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </BookCard>
  );
}

export default LibraryBookCard;
