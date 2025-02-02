import { BookCard } from "@/components/Card";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { UserBooksUpdate } from "@/drizzle/schema";
import { api } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function Library() {
  const { user, isLoaded } = useUser();

  const { register, handleSubmit } = useForm();

  const { data: library, refetch } = api.books.find.useQuery(user?.id ?? "", {
    enabled: !!isLoaded,
  });

  const { mutate: removeBook } = api.books.remove.useMutation({
    onSuccess: () => refetch(),
  });

  const { mutate: updateBook } = api.books.update.useMutation({
    onSuccess: () => refetch(),
  });

  const handleUpdate = async (id: number, data: UserBooksUpdate) => {
    const dataToUpdate = {
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      rating: Number(data.rating),
      status: data.status,
    };
    
    updateBook({
      id: Number(id),
      data: {
        ...dataToUpdate,
        startDate: dataToUpdate.startDate instanceof Date ? dataToUpdate.startDate : null,
        endDate: dataToUpdate.endDate instanceof Date ? dataToUpdate.endDate : null,
      },
    });
  };

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

              <div className="flex gap-2 p-2 group-hover:flex items-center">
                <Modal
                  title="Edit Book"
                  trigger={
                    <div className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </div>
                  }
                  primaryAction={<Button type="submit">Save</Button>}
                >
                  <form
                    onSubmit={handleSubmit((data) =>
                      handleUpdate(book.id, data),
                    )}
                  >
                    <div>
                      <input
                        type="text"
                        {...register("status")}
                        defaultValue={book.status ?? ""}
                        placeholder="Status (Reading/Read)"
                      />
                      <input
                        type="date"
                        defaultValue={book.startDate ?? ""}
                        {...register("startDate")}
                      />
                      <input
                        type="date"
                        defaultValue={book.endDate ?? ""}
                        {...register("endDate")}
                      />
                      <input
                        type="number"
                        defaultValue={book.rating ?? 0}
                        {...register("rating")}
                        placeholder="Rating"
                      />
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </Modal>
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
