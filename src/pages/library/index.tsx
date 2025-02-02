import { Button } from "@/components/ui/button";
import React from "react";

export default function Library() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library</h1>
        <Button>Add Book</Button>
      </div>
    </div>
  );
}
