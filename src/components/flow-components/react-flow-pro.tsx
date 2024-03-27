import { getElements } from "@/lib/flow";
import { HierarchyNode } from "d3-hierarchy";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  ControlButton,
  Controls,
  Panel,
  Node as RFNode,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import { proOptions } from "../../app/shared/constants";
import { useUIStore } from "../../app/stores/useUI";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Download } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Icons } from "@/app/shared/Icons";

type ProProps = {
  animationDuration?: number;
  h: HierarchyNode<unknown>;
};

function ReactFlowPro({ animationDuration = 200, h }: ProProps) {
  const initialElements = getElements(h);
  const [nodes, setNodes] = useState(initialElements.nodes);
  const [edges, setEdges] = useState(initialElements.edges);
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const { toggleDrawer, setDrawerDetails } = useUIStore(
    useShallow((state) => ({
      setDrawerDetails: state.setDrawerDetails,
      toggleDrawer: state.toggleDrawer,
    }))
  );
  const handleNodeClick = (_: any, node: RFNode) => {
    const currentNode: any = h.find((_node) => {
      return node.id === _node.id;
    });
    const root: any = h.data;

    if (!currentNode) return;
    if (!currentNode._children) {
    }

    const isExpanded = !!currentNode.children;
    currentNode.children = isExpanded ? null : currentNode._children;
    if (!currentNode._children) {
      toggleDrawer();
      setDrawerDetails({
        query: root.name,
        parent: currentNode.parent.data.name,
        child: currentNode.data.name,
      });
    }
    const nextElements = getElements(h);
    setNodes(nextElements.nodes);
    setEdges(nextElements.edges);
  };

  useEffect(() => {
    fitView({ duration: animationDuration });
  }, [nodes, fitView, animationDuration]);

  return (
    <ReactFlow
      minZoom={-Infinity}
      fitView
      // [TODO] : add nodeTypes and edgeTypes for memoisation
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      elementsSelectable={false}
      snapToGrid
      proOptions={proOptions}
      draggable={true}
    >
      <Background />
      <Controls
        fitViewOptions={{
          duration: 800,
        }}
        onZoomIn={() =>
          zoomIn({
            duration: 800,
          })
        }
        onZoomOut={() =>
          zoomOut({
            duration: 800,
          })
        }
        onInteractiveChange={(isInteractive) => {
          setNodes((prevNodes) =>
            prevNodes.map((node) => ({ ...node, draggable: isInteractive }))
          );
        }}
      >
        <ControlButton
          about="Download Roadmap"
          onClick={() =>
            toast.info("[TODO] Impl download.", {
              position: "top-center",
            })
          }
        >
          <Download className="font-bold" />
        </ControlButton>
      </Controls>
      <Panel position="bottom-right">
        <span className="font-semibold text-gray-400">
          AI Roadmap Generator [BETA v0.1]
        </span>
      </Panel>
    </ReactFlow>
  );
}

export default ReactFlowPro;
