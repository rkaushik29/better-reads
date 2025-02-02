import { useEffect } from "react";
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

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { mutate: getOrCreateUser } = api.users.getOrCreateUser.useMutation();

  useEffect(() => {
    if (user?.id && user?.fullName && user?.primaryEmailAddress?.emailAddress) {
      getOrCreateUser({
        authId: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
      });
    }
  }, [user, getOrCreateUser]);

  const {
    data: books,
    isLoading: booksLoading,
    error: booksError,
  } = api.users.getAllBooks.useQuery();

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
                new Date(b.updatedAt ?? "").getTime() - new Date(a.updatedAt ?? "").getTime()
            )
            .map((book, index) => {
              const createdAt = new Date(book.createdAt ?? "");
              const updatedAt = new Date(book.updatedAt ?? "");
              const isNew = createdAt.getTime() === updatedAt.getTime();
              const actionText = isNew
                ? `Added ${book.title}`
                : `Updated ${book.title}`

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        icon={<Heart />}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        icon={<WandSparkles />}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        icon={<MessageCircle />}
                      />
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
        </div>
      )}
    </div>
  );
}
