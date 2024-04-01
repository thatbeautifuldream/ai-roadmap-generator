import { HierarchyNode, hierarchy } from "d3-hierarchy";
import { Loader2 } from "lucide-react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/base.css";
import "reactflow/dist/style.css";
import { Node } from "../../app/shared/types/common";
import { Drawer } from "./drawer";
import ReactFlowPro from "./react-flow-pro";

type Props = {
  data: Node[];
  isPending: boolean;
  roadmapId?: string;
};

function ExpandCollapse(props: Props) {
  const { data, isPending, roadmapId } = props;

  const h: HierarchyNode<unknown> = hierarchy<unknown>(data[0]);
  h.descendants().forEach((d: any, i: number) => {
    d.id = `${i}`;
    d._children = d.children;
    d.children = null;
  });

  if (isPending)
    return (
      <div className="w-full h-[86vh] flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  return (
    <div className="w-full h-[84vh]">
      <ReactFlowProvider>
        <Drawer roadmapId={roadmapId} />
        <ReactFlowPro {...props} h={h} />
      </ReactFlowProvider>
    </div>
  );
}

export default ExpandCollapse;
