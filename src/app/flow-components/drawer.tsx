import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

export const Drawer = () => {
  const { drawerOpen, toggleDrawer, drawerDetails } = useUIStore(
    useShallow((state) => ({
      drawerOpen: state.drawerOpen,
      toggleDrawer: state.toggleDrawer,
      drawerDetails: state.drawerDetails,
    }))
  );

  const { data, isSuccess } = useQuery({
    queryKey: [
      drawerDetails?.query,
      drawerDetails?.parent,
      drawerDetails?.child,
    ],
    queryFn: async () => {
      return await axios.post("/api/v1/openai/details", {
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
  });

  return (
    <Sheet open={drawerOpen} onOpenChange={toggleDrawer}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{drawerDetails?.parent}</SheetTitle>
          <SheetDescription>
            {isSuccess && (
              <div>
                <div className="flex flex-wrap mb-2">
                  {data.data.text.link && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {" "}
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
                <p>{data.data.text.description}</p>
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
