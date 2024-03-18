import { HierarchyNode, tree } from "d3-hierarchy";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  Node as RFNode,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import useAnimatedNodes from "../../hooks/use-animated-nodes";
import { Node } from "../shared/types/common";
import { useUIStore } from "../stores/useUI";
import { proOptions } from "../shared/constants";
import { getElements } from "@/lib/flow";

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
  const { fitView } = useReactFlow();
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
      nodes={nodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      elementsSelectable={false}
      snapToGrid
      proOptions={proOptions}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}

export default ReactFlowPro;
