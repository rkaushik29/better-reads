import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/utils/trpc";

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

  if (!isLoaded) {
    return <div>Loading user information...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access the editor.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Welcome, {user.fullName}!</h1>
    </div>
  );
}