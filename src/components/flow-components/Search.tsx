"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  console.log({ searchData });

  return (
    <>
      <div className="flex flex-row">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button
          isLoading={isSearchPending}
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
      {searchData &&
        searchData.data.map((item: any) => (
          <Card key={item.id}>{item.title}</Card>
        ))}
    </>
  );
};
