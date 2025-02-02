import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";

interface BookDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  book: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const toSentenceCase = (str: string): string => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const BookDialog: React.FC<BookDialogProps> = ({
  book,
  open,
  onOpenChange,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const user = useUser();

  const { mutateAsync: createBook } = api.books.create.useMutation();

  const handleAddToLibrary = async (book: any, id: string) => {
    const data = {
      userId: user.user?.id || "",
      googleBookId: id,
      title: book.title,
      authors: book.authors?.join(","),
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      category: book.category,
      status: book.status,
      description: book.description,
      printedPageCount: book.printedPageCount,
      maturityRating: book.maturityRating,
      imageLinks: book.imageLinks.thumbnail,
      previewLink: book.previewLink,
      startDate: book.startDate,
      endDate: book.endDate,
      rating: book.rating,
      review: book.review,
    };

    await createBook({ data });
  };

  const renderDescription = (desc: string) => {
    if (desc.length <= 1000) {
      return <p className="text-sm text-gray-700">{desc}</p>;
    }
    if (!showFullDescription) {
      const truncated = `${desc.substring(0, 1000)}...`;
      return (
        <div className="relative">
          <p className="text-sm text-gray-700">{truncated}</p>
          <Button
            variant="link"
            className="mt-2 text-sm"
            onClick={() => setShowFullDescription(true)}
          >
            Read more
          </Button>
        </div>
      );
    }
    return (
      <div className="max-h-60 overflow-y-auto">
        <p className="text-sm text-gray-700">{desc}</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg bg-slate-100 p-6">
        <DialogHeader>
          <DialogTitle className="p-2">{book.volumeInfo.title}</DialogTitle>
          <DialogDescription>
            {book.volumeInfo.authors
              ? book.volumeInfo.authors.join(", ")
              : "Unknown Author"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          {book.volumeInfo.imageLinks && (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              className="mb-4 mx-auto"
            />
          )}
          <div>
            <strong>Printed Page Count: </strong>
            {book.volumeInfo.pageCount || "N/A"}
          </div>
          <div>
            <strong>Maturity Rating: </strong>
            {book.volumeInfo.maturityRating
              ? toSentenceCase(book.volumeInfo.maturityRating)
              : "N/A"}
          </div>
          <div>
            <strong>Publisher: </strong>
            {book.volumeInfo.publisher || "N/A"}
          </div>
          <div>
            <strong>Published Date: </strong>
            {book.volumeInfo.publishedDate || "N/A"}
          </div>
          <div className="mt-4">
            <strong>Description: </strong>
            {book.volumeInfo.description
              ? renderDescription(book.volumeInfo.description)
              : "No description available."}
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="default"
            onClick={() => handleAddToLibrary(book.volumeInfo, book.id)}
          >
            Add to library
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookDialog;

