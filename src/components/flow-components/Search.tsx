"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/queries";
import { useState } from "react";

export const Search = () => {
  const [search, setSearch] = useState("");

  const {
    data: searchData,
    mutate: searchMutate,
    isPending: isSearchPending,
  } = useSearch(search);

  return (
    <div className="flex flex-row">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      <Button
        onClick={() => {
          searchMutate(
            { body: { query: search } },
            {
              onSuccess: (data) => {
                console.log(data);
              },
            }
          );
        }}
      >
        Search
      </Button>
    </div>
  );
};
