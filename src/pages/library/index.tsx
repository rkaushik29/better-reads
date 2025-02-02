import { Button } from "@/components/ui/button";
import React from "react";
import { api } from "@/utils/trpc";

export default function Library() {
  const { data, isLoading } = api.hello.useQuery({ text: "client" });
  console.log(data);
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library</h1>
        <Button>Add Book</Button>
      </div>
    </div>
  );
}
