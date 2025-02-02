import { BookCard } from "@/components/Card";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { UserBooksUpdate } from "@/drizzle/schema";
import { api } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { Pencil, Trash, Check, Clock, Search } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { LibraryBookCard } from "@/components/LibraryBookCard";
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
        startDate: dataToUpdate.startDate instanceof Date ? dataToUpdate.startDate.toISOString() : "",
        endDate: dataToUpdate.endDate instanceof Date ? dataToUpdate.endDate.toISOString() : "",
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
          <LibraryBookCard key={book.id} book={book} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
