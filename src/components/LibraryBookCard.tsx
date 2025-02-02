import React from "react";
import { Trash, Check, Clock, Search } from "lucide-react";

import { BookCard } from "@/components/Card";
import EditBookModal from "@/components/EditBookModal";
import { Button } from "@/components/ui/button";
import { UserBooksUpdate } from "@/drizzle/schema";

export interface LibraryBook {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
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
  const handleDeleteButton = () => {
    onDelete(book.id);
  };

  return (
    <div className="relative group">
      <BookCard title={book.title} description={book.authors ?? ""}>
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            src={book.imageLinks ?? ""}
            alt={book.title}
            className="h-48 w-full object-contain"
          />

          <div className="flex items-center">
            {book.status && renderStatusIcon(book.status)}
          </div>

          <div className="text-sm text-gray-500">{book.printedPageCount}</div>
        </div>
      </BookCard>
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <EditBookModal book={book} onUpdate={onUpdate} />
        <Button
          onClick={handleDeleteButton}
          className="bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
          size="icon"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default LibraryBookCard;
