"use client";
import {
  deleteRoadmapById,
  isRoadmapGeneratedByUser,
} from "@/actions/roadmaps";
import { EyeIcon } from "@/app/shared/Icons";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function RoadmapCard({
  title,
  views,
  timeAgo,
  slug,
}: {
  title?: string;
  views?: string;
  timeAgo?: string;
  slug?: string;
}) {
  const router = useRouter();
  const [isCreator, setIsCreator] = useState<boolean>(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (slug) {
        const isUserCreator = await isRoadmapGeneratedByUser(slug);
        setIsCreator(isUserCreator);
      }
    };

    checkOwnership();
  }, [slug]);

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents the link navigation
    if (!slug) return;
    const response = await deleteRoadmapById(slug);
    // @ts-ignore
    if (response.status === "success") {
      toast.success("Deleted", {
        description: "Roadmap deleted successfully ",
        duration: 4000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
        className="flex flex-col rounded-md border transition-colors hover:bg-gray-100 group"
        style={{ maxHeight: "150px", overflow: "hidden" }}
      >
        <Link href={`/roadmap/${slug}`} className="flex-grow">
          <p className="flex flex-col">
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
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                {timeAgo}
              </span>
            </div>
          </p>
        </Link>
        {isCreator && (
          <Trash
            onClick={handleDelete}
            className="text-red-500 w-4 h-4 self-end mr-2 mb-2 cursor-pointer"
          />
        )}
      </div>
    </>
  );
}

export default RoadmapCard;
