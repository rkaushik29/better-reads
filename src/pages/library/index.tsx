import { BookCard } from "@/components/Card";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { UserBooksUpdate } from "@/drizzle/schema";
import { api } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { Pencil, Trash, Check, Clock, Search } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

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
        startDate: dataToUpdate.startDate instanceof Date ? dataToUpdate.startDate : "",
        endDate: dataToUpdate.endDate instanceof Date ? dataToUpdate.endDate : "",
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
              <div className="flex items-center">
                {book.status && renderStatusIcon(book.status)}
              </div>
              <div className="text-sm text-gray-500">
                {book.printedPageCount}
              </div>

              <div className="flex gap-2 p-2 group-hover:flex items-center">
                <Modal
                  title={`Edit ${book.title}`}
                  trigger={
                    <div className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </div>
                  }
                >
                  <form
                    onSubmit={handleSubmit((data) =>
                      handleUpdate(book.id, data),
                    )}
                  >
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
                        defaultValue={book.startDate ? new Date(book.startDate).toISOString().split('T')[0] : ""}
                        {...register("startDate")}
                      />
                      <Input
                        type="date"
                        defaultValue={book.endDate ? new Date(book.endDate).toISOString().split('T')[0] : ""}
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
