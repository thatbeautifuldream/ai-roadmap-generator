import { getElements } from "@/lib/flow";
import { HierarchyNode } from "d3-hierarchy";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node as RFNode,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import useAnimatedNodes from "../../hooks/use-animated-nodes";
import { proOptions } from "../shared/constants";
import { useUIStore } from "../stores/useUI";

type ProProps = {
  animationDuration?: number;
  h: HierarchyNode<unknown>;
};

function ReactFlowPro({ animationDuration = 200, h }: ProProps) {
  const initialElements = getElements(h);
  const [nodes, setNodes] = useAnimatedNodes(initialElements.nodes, {
    duration: animationDuration,
  });
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
        // Add custom UI for controls where we have our buttons invoke zoomIn, zoomOut
        // this one causes glitches
        onZoomIn={() => zoomIn({ duration: 800 })}
        onZoomOut={() => zoomOut({ duration: 800 })}
      />
    </ReactFlow>
  );
}

export default ReactFlowPro;
