import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LibraryBook } from "@/components/LibraryBookCard";
import { UserBooksUpdate } from "@/drizzle/schema";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

interface EditLibraryBookModalProps {
  book: LibraryBook;
  onUpdate: (id: number, data: UserBooksUpdate) => void;
}

export function EditLibraryBookModal({ book, onUpdate }: EditLibraryBookModalProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<UserBooksUpdate>({
    defaultValues: {
      title: book.title || "",
      authors: book.authors || "",
      category: book.category || "",
      description: book.description || "",
      status: book.status || "",
      // Store dates as strings in YYYY-MM-DD format
      startDate: book.startDate ? new Date(book.startDate) : undefined,
      endDate: book.endDate ? new Date(book.endDate) : undefined,
    },
  });

  // Watch the date values so we can show them in the button labels
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");

  const handleUpdate = (data: UserBooksUpdate) => {
    // Convert the date strings to ISO strings (or leave undefined if blank)
    const startDate = data.startDate ? new Date(data.startDate).toISOString() : undefined;
    const endDate = data.endDate ? new Date(data.endDate).toISOString() : undefined;

    onUpdate(book.id, {
      ...data,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  };

  // When the book prop changes, reset the form values.
  useEffect(() => {
    reset({
      title: book.title || "",
      authors: book.authors || "",
      category: book.category || "",
      description: book.description || "",
      status: book.status || "",
      startDate: book.startDate ? new Date(book.startDate) : undefined,
      endDate: book.endDate ? new Date(book.endDate) : undefined,
    });
  }, [book, reset]);

  return (
    <Modal
      title={`Edit ${book.title || "Book"}`}
      trigger={
        <Button className="bg-green-500 hover:bg-green-600 rounded-full text-white" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    >
      <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <Input
            type="text"
            defaultValue={book.title || ""}
            {...register("title")}
            placeholder="Title"
          />

          <Input
            type="text"
            defaultValue={book.authors || ""}
            {...register("authors")}
            placeholder="Authors"
          />

          <Input
            type="text"
            defaultValue={book.category || ""}
            {...register("category")}
            placeholder="Category"
          />

          {/* Description */}
          <textarea
            defaultValue={book.description || ""}
            {...register("description")}
            placeholder="Description"
            className="w-full p-2 border rounded"
            rows={4}
          />

          {/* Image Preview */}
          <div className="w-48 h-64 border rounded overflow-hidden">
            {book.imageLinks ? (
              <img
                src={book.imageLinks}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Status as Tag-Chips */}
          <div className="flex gap-2">
            {["wantToRead", "reading", "read"].map((statusOption) => (
              <label
                key={statusOption}
                className={`cursor-pointer px-3 py-1 border rounded-full ${
                  watch("status") === statusOption ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                <input
                  type="radio"
                  value={statusOption}
                  {...register("status")}
                  defaultChecked={book.status === statusOption}
                  className="hidden"
                />
                {statusOption === "wantToRead" ? "TBR" : statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </label>
            ))}
          </div>

          {/* Start Date with Calendar Hover Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">
                  {startDateValue ? new Date(startDateValue).toLocaleDateString() : "Select Start Date"}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDateValue ? new Date(startDateValue) : undefined}
                  onSelect={(date: Date | undefined) => {
                    setValue("startDate", date ? date : undefined);
                  }}
                />
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* End Date with Calendar Hover Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">
                  {endDateValue ? new Date(endDateValue).toLocaleDateString() : "Select End Date"}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDateValue ? new Date(endDateValue) : undefined}
                  onSelect={(date: Date | undefined) => {
                    setValue("endDate", date ? date : undefined);
                  }}
                />
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Submit Button */}
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditLibraryBookModal;