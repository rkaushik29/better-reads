import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/utils/trpc";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, WandSparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchedBookIds, setFetchedBookIds] = useState<Set<string>>(new Set());

  // UseQuery for snippet
  const {
    data: snippetData,
    isLoading: snippetLoading,
    refetch: refetchSnippet,
  } = api.ai.getBookSnippet.useQuery(
    {
      title: selectedBook?.title ?? "",
      // If authors is an array, join it. Otherwise use the raw string.
      author: Array.isArray(selectedBook?.authors)
        ? selectedBook.authors.join(", ")
        : selectedBook?.authors ?? "",
    },
    {
      enabled: false, // We will manually fetch only after the user clicks
      onSuccess: () => {
        if (selectedBook?.id) {
          console.log(snippetData);
          setFetchedBookIds(prev => new Set(prev).add(selectedBook.id));
        }
        setIsDialogOpen(true);
      },
    }
  );

  const { mutate: getOrCreateUser } = api.users.getOrCreateUser.useMutation();
  const {
    data: books,
    isLoading: booksLoading,
    error: booksError,
  } = api.users.getAllBooks.useQuery();

  // Create or fetch the user if needed
  useEffect(() => {
    if (user?.id && user?.fullName && user?.primaryEmailAddress?.emailAddress) {
      getOrCreateUser({
        authId: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
      });
    }
  }, [user, getOrCreateUser]);

  // Loading checks
  if (!isLoaded) {
    return <div>Loading user information...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access the editor.</div>;
  }

  return (
    <div className="p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="text-3xl font-bold mb-4"
      >
        Welcome, {user.fullName}!
      </motion.h1>

      {booksLoading && <div>Loading books...</div>}
      {booksError && <div>Error loading books.</div>}

      {books && (
        <div className="flex flex-col items-center w-full space-y-4">
          {books
            .slice()
            .sort(
              (a, b) =>
                new Date(b.updatedAt ?? "").getTime() -
                new Date(a.updatedAt ?? "").getTime()
            )
            .map((book, index) => {
              const createdAt = new Date(book.createdAt ?? "");
              const updatedAt = new Date(book.updatedAt ?? "");
              const isNew = createdAt.getTime() === updatedAt.getTime();
              const actionText = isNew
                ? `Added ${book.title}`
                : `Updated ${book.title}`;

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Card className="w-fit">
                    <CardHeader className="flex items-start space-x-2">
                      <CardTitle>{book.userName}</CardTitle>
                    </CardHeader>

                    <CardContent className="rounded-md w-fit">
                      <img
                        src={book.imageLinks ?? ""}
                        alt={`${book.title} cover`}
                        className="object-contain mb-2 h-64 w-64"
                      />
                      <p>{actionText}</p>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <Button variant="ghost" size="icon">
                        <Heart />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBook(book);
                          if (!fetchedBookIds.has(book.id.toString())) {
                            setIsDialogOpen(true);
                            refetchSnippet();
                          }
                        }}
                      >
                        <WandSparkles />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageCircle />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
        </div>
      )}

      {/* AI Generated Snippet Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-pink-200">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {snippetLoading ? (
              <p>Generating snippet...</p>
            ) : snippetData ? (
              <p className="whitespace-pre-wrap">{snippetData.snippet}</p>
            ) : (
              <p>No snippet available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}