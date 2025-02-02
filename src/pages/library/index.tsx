import { UserBooksUpdate } from "@/drizzle/schema";
import { api } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { LibraryBookCard } from "@/components/LibraryBookCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarTimeline } from "@/components/CalendarTimeline";

export default function Library() {
  const { user, isLoaded } = useUser();

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
        startDate:
          dataToUpdate.startDate instanceof Date
            ? dataToUpdate.startDate.toISOString()
            : "",
        endDate:
          dataToUpdate.endDate instanceof Date
            ? dataToUpdate.endDate.toISOString()
            : "",
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
      <Tabs defaultValue="gallery">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger
            value="gallery"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:font-bold"
          >
            Gallery
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:font-bold"
          >
            Progress
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:font-bold"
          >
            Timeline
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gallery">
          <div className="flex gap-4 mt-4 flex-wrap justify-center">
            {library?.map((book) => (
              <LibraryBookCard
                key={book.id}
                book={book}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="progress">
          <div className="mt-4">
            <p>Progress content goes here.</p>
          </div>
        </TabsContent>
        <TabsContent value="timeline">
          <div className="mt-4">
            <div className="container mx-auto py-10">
              <h1 className="mb-8 text-3xl font-bold">Timeline</h1>
              <CalendarTimeline
                events={library?.map((book) => ({
                  id: String(book.id),
                  title: book.title,
                  startDate: book.startDate ? book.startDate : book.createdAt,
                  endDate: book.endDate ? book.endDate : book.createdAt,
                  status: book.status as "wanToRead" | "read" | "reading",
                  rating: book.rating,
                })) ?? []}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

