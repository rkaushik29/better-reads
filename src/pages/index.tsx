import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

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
