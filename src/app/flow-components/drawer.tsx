import { Sheet, SheetContent, SheetDescription } from "@/components/ui/sheet";
import { useShallow } from "zustand/react/shallow";
import { useUIStore } from "../stores/useUI";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IOrilley } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

export const Drawer = () => {
  const { drawerOpen, toggleDrawer, drawerDetails, model } = useUIStore(
    useShallow((state) => ({
      drawerOpen: state.drawerOpen,
      toggleDrawer: state.toggleDrawer,
      drawerDetails: state.drawerDetails,
      model: state.model,
    }))
  );

  const { data, isSuccess } = useQuery({
    queryKey: [
      drawerDetails?.query,
      drawerDetails?.parent,
      drawerDetails?.child,
    ],
    queryFn: async () => {
      return await axios.post(`/api/v1/${model}/details`, {
        query: drawerDetails?.query,
        child: drawerDetails?.child,
        parent: drawerDetails?.parent,
      });
    },
    enabled: Boolean(
      drawerDetails &&
        drawerDetails?.query &&
        drawerDetails?.parent &&
        drawerDetails?.child
    ),
    staleTime: Infinity,
  });

  const { data: booksData, isSuccess: booksSuccess } = useQuery({
    queryKey: [
      "Books",
      drawerDetails?.query,
      drawerDetails?.parent,
      drawerDetails?.child,
    ],
    queryFn: async () => {
      return await axios.post(`/api/v1/orilley`, {
        data: { query: drawerDetails?.child },
      });
    },
    staleTime: Infinity,
    retry: false,
    enabled: Boolean(drawerDetails?.child),
  });

  return (
    <Sheet open={drawerOpen} onOpenChange={toggleDrawer}>
      <SheetContent>
        <div className="mb-4">
          <p className="text-xs text-slate-400">{drawerDetails?.parent}</p>
          <p className="font-light">{drawerDetails?.child}</p>
        </div>
        <div>
          {isSuccess && (
            <div>
              <div className="flex flex-wrap mb-2">
                {data.data.text.link && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <a
                          href={data.data.text.link}
                          target="_blank"
                          referrerPolicy="no-referrer"
                        >
                          <img
                            src={`https://en.wikipedia.org/static/images/icons/wikipedia.png`}
                            alt="Wikipedia Logo"
                            className="w-4"
                          />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Wikipedia</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-sm text-slate-600">
                {data.data.text.description}
              </p>
              <div className="mt-4">
                <p className="text-black mb-2">Recommended Books</p>
                <div className="flex flex-col gap-3">
                  {booksData?.data?.data?.results?.map(
                    (book: IOrilley["data"][number], id: number) => (
                      <a
                        className="flex items-center bg-white rounded-md overflow-hidden cursor-pointer"
                        href={book.url}
                        target="_blank"
                        key={book.id}
                      >
                        <img
                          className="w-20 h-auto"
                          src={book.cover_url}
                          alt={book.title}
                        />
                        <div className="p-4">
                          <p className="text-base font-semibold mb-1">
                            {book.title}
                          </p>
                          <p className="text-gray-700 text-sm">
                            By {book.authors[0]}
                          </p>
                          <p className="text-gray-600 text-xs">
                            Complete in {formatDuration(book.duration_seconds)}
                          </p>
                        </div>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
