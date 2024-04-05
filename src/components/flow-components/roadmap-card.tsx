"use client";
import { deleteRoadmapById, deleteSavedRoadmapById } from "@/actions/roadmaps";
import { EyeIcon } from "@/app/shared/Icons";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

function RoadmapCard({
  title,
  views,
  timeAgo,
  slug,
  savedRoadmapCard,
  savedRoadmapId,
}: {
  title?: string;
  views?: string;
  timeAgo?: string;
  slug?: string;
  savedRoadmapCard?: boolean;
  savedRoadmapId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    // Prevents the link navigation
    if (!slug) return;

    if (savedRoadmapCard) {
      const res = await deleteSavedRoadmapById(savedRoadmapId);
      if (res.status === "success") {
        toast.success("Deleted", {
          description: "Roadmap deleted successfully ",
          duration: 4000,
        });
        router.refresh();
        return; // Exit the function after deleting saved roadmap
      }
    }

    const response = await deleteRoadmapById(slug);
    if (response.status === "success") {
      toast.success("Deleted", {
        description: "Roadmap deleted successfully ",
        duration: 4000,
      });
      router.refresh();
    } else {
      toast.error("Error", {
        // @ts-ignore
        description: response.message,
        duration: 4000,
      });
    }
  };

  return (
    <>
      <div
        className="flex rounded-md border transition-colors hover:bg-gray-100 group relative cursor-pointer"
        style={{ maxHeight: "150px", overflow: "hidden" }}
      >
        <Link href={`/roadmap/${slug}`} className="flex-grow">
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-2.5 py-2.5">
              <h2 className="flex-grow text-base font-medium leading-tight">
                {title}
              </h2>
            </div>
            <div className="flex items-center justify-between gap-2 px-2.5 py-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <EyeIcon />
                {views}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-gray-400 absolute right-2">
                {timeAgo}
              </span>
            </div>
          </div>
        </Link>

        {pathname.includes(`/dashboard`) && (
          <button
            type="button"
            className="group relative m-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-600/20"
            onClick={handleDelete}
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        )}
      </div>
    </>
  );
}

export default RoadmapCard;
