import { getElements } from "@/lib/flow";
import { HierarchyNode } from "d3-hierarchy";
import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  Node as RFNode,
  useReactFlow,
} from "reactflow";
import { useShallow } from "zustand/react/shallow";
import useAnimatedNodes from "../../hooks/use-animated-nodes";
import { proOptions } from "../shared/constants";
import { useUIStore } from "../stores/useUI";
import { ContentNode } from "../shared/types/common";
import { ReactFlowContentNode, getGraph } from "@/utils/graph";
import dagre from "dagre";
import customNode from "./custom-node";

type ProProps = {
  animationDuration?: number;
  data: ContentNode[];
};

const nodeWidth = 172;
const nodeHeight = 36;

const positionMap: { [key: string]: Position } = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom,
};

const nodeTypes = {
  customNode: customNode,
};

function ReactFlowPro({ animationDuration = 200, data }: ProProps) {
  const [stateNodes, setStateNodes] = useState(data); // correct type

  // const initialElements = getElements(h);
  // const [nodes, setNodes] = useAnimatedNodes(initialElements.nodes, {
  //   duration: animationDuration,
  // });
  // const [edges, setEdges] = useState(initialElements.edges);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  // const { toggleDrawer, setDrawerDetails } = useUIStore(
  //   useShallow((state) => ({
  //     setDrawerDetails: state.setDrawerDetails,
  //     toggleDrawer: state.toggleDrawer,
  //   }))
  // );
  // const handleNodeClick = (_: any, node: RFNode) => {
  //   const currentNode: any = h.find((_node) => {
  //     return node.id === _node.id;
  //   });
  //   const root: any = h.data;

  //   if (!currentNode) return;
  //   if (!currentNode._children) {
  //   }

  //   const isExpanded = !!currentNode.children;
  //   currentNode.children = isExpanded ? null : currentNode._children;
  //   if (!currentNode._children) {
  //     toggleDrawer();
  //     setDrawerDetails({
  //       query: root.name,
  //       parent: currentNode.parent.data.name,
  //       child: currentNode.data.name,
  //     });
  //   }
  //   const nextElements = getElements(h);
  //   setNodes(nextElements.nodes);
  //   setEdges(nextElements.edges);
  // };

  // useEffect(() => {
  //   fitView({ duration: animationDuration });
  // }, [nodes, fitView, animationDuration]);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const getLayoutedElements = (
    nodes: Node<ReactFlowContentNode>[],
    edges: Edge[],
    direction = "LR"
  ) => {
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutNodes = nodes.map((node, index) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = positionMap[direction[0]];
      node.sourcePosition = positionMap[direction[1]];

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { layoutNodes };
  };

  const handleNodeClick = (_, node: any) => {
    const newNodes = nodes.map((n) => {
      if (n.id === node.id) {
        n.data.isExpanded = !n.data.isExpanded;
      }
      return n;
    });

    setStateNodes([...newNodes]);
  };

  const { nodes, edges } = useMemo(() => getGraph(stateNodes), [stateNodes]);

  const { layoutNodes } = useMemo(
    () => getLayoutedElements(nodes, edges),
    [nodes, edges]
  );

  return (
    <ReactFlow
      minZoom={0.4}
      maxZoom={2}
      fitView
      nodes={layoutNodes}
      edges={edges}
      onNodeClick={handleNodeClick}
      elementsSelectable={false}
      snapToGrid
      proOptions={proOptions}
      draggable={true}
      nodeTypes={nodeTypes}
    >
      <Background />
      <Controls
      // Add custom UI for controls where we have our buttons invoke zoomIn, zoomOut
      // this one causes glitches
      // onZoomIn={() => zoomIn({ duration: 800 })}
      // onZoomOut={() => zoomOut({ duration: 800 })}
      />
    </ReactFlow>
  );

  return <div>hi</div>;
}

export default ReactFlowPro;
