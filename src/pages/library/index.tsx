import { BookCard } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { Pencil, Trash } from "lucide-react";
import React from "react";

export default function Library() {
  const { user, isLoaded } = useUser();
  const { data: library, refetch } = api.books.find.useQuery(user?.id ?? "", {
    enabled: !!isLoaded,
  });
  const { mutate: removeBook } = api.books.remove.useMutation({
    onSuccess: refetch(),
  });

  const handleDelete = async (id: number) => {
    removeBook(id);
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex justify-center w-full">
        <h1 className="text-3xl font-bold">Library</h1>
      </div>
      <div className="flex gap-4 mt-4">
        {library?.map((book) => (
          <BookCard
            title={book.title}
            description={book.authors ?? ""}
            key={book.id}
          >
            <div className="group flex flex-col items-center justify-center gap-2">
              <img src={book.imageLinks ?? ""} alt={book.title} />

              <div className="text-sm text-gray-500">{book.status}</div>
              <div className="text-sm text-gray-500">
                {book.printedPageCount}
              </div>

              <div className="flex gap-2 p-2 group-hover:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    /* handle edit */
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleDelete(book.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </BookCard>
        ))}
      </div>
    </div>
  );
}
