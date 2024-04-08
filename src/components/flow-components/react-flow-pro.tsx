import { getElements } from "@/lib/flow";
import { HierarchyNode } from "d3-hierarchy";
import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  ControlButton,
  Controls,
  Panel,
  Node as RFNode,
  getRectOfNodes,
  getTransformForBounds,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import { proOptions } from "../../app/shared/constants";
import { useUIStore } from "@/lib/stores";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import {
  DIAGRAM_IMAGE_HEIGHT,
  DIAGRAM_IMAGE_WIDTH,
  downloadImage,
} from "@/lib/utils";

type ProProps = {
  animationDuration?: number;
  h: HierarchyNode<unknown>;
};

function ReactFlowPro({ animationDuration = 200, h }: ProProps) {
  const { getNodes, fitView, zoomIn, zoomOut } = useReactFlow();
  const initialElements = getElements(h);
  const [nodes, setNodes] = useState(initialElements.nodes);
  const [edges, setEdges] = useState(initialElements.edges);
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

  const downloadRoadmapPng = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const [x, y] = getTransformForBounds(
      nodesBounds,
      DIAGRAM_IMAGE_WIDTH,
      DIAGRAM_IMAGE_HEIGHT,
      0.5,
      2
    );

    toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "transparent",
      width: DIAGRAM_IMAGE_WIDTH,
      height: DIAGRAM_IMAGE_HEIGHT,
      style: {
        width: String(DIAGRAM_IMAGE_WIDTH),
        height: String(DIAGRAM_IMAGE_HEIGHT),
        transform: `translate(${x}px, ${y}px) scale(1)`,
      },
    }).then(downloadImage);
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
          className="md:mb-0 mb-16"
          about="Download Roadmap"
          onClick={() => downloadRoadmapPng()}
        >
          <Download className="font-bold" />
        </ControlButton>
      </Controls>
      <Panel position="top-center">
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          CLICK NODE TO EXPAND
        </span>
      </Panel>
    </ReactFlow>
  );
}

export default ReactFlowPro;
