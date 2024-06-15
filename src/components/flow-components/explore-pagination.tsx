"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

export default function ExplorePagination() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`/explore?page=${parseInt(page) - 1}`} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{page}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`/explore?page=${parseInt(page) + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
