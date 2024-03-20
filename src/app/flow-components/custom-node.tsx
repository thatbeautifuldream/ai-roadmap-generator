import { Handle, NodeProps, Position } from "reactflow";
import { ContentNode } from "../shared/types/common";
import Image from "next/image";

function CustomNode({
  data,
  sourcePosition = Position.Top,
  targetPosition = Position.Bottom,
}: NodeProps<ContentNode>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          <Image src="/lol.png" alt="" width={100} height={100} />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">hi baby</div>
          <div className="text-gray-500">🫦</div>
        </div>
      </div>

      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}

export default CustomNode;
