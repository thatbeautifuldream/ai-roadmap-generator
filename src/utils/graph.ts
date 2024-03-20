import { ContentNode } from "@/app/shared/types/common";
import { Edge, Node } from "reactflow";

export interface ReactFlowContentNode {
  name: string;
  isExpanded: boolean;
  children?: ContentNode[];
}

export function getGraph(data: ContentNode[]) {
  const nodes: Node<ReactFlowContentNode>[] = [
    {
      id: data[0].id,
      data: {
        name: data[0].name,
        isExpanded:
          data[0].isExpanded !== undefined ? data[0].isExpanded : true,
        children: data[0].children,
      },
      position: { x: 100, y: 100 },
      type: "customNode",
    },
  ];
  const edges: Edge[] = [];

  // add step to graph and connect to base node
  // traverse the data and add nodes and edges

  console.log(data);

  const addNodeToGraph = (node: ContentNode, nodeId: string | null) => {
    if (node.isExpanded !== undefined) return;

    nodes.push({
      id: node.id,
      data: {
        name: node.name,
        isExpanded: node.isExpanded !== undefined ? node.isExpanded : true,
        children: node.children,
      },
      position: { x: 250, y: 25 },
      type: "customNode",
    });

    if (nodeId) {
      edges.push({
        id: `${nodeId}-${node.id}`,
        source: nodeId,
        target: node.id,
        animated: true,
      });
    }

    // if isExpanded field is not there means it is first time node
    // so we will add it to graph and return

    if (node.isExpanded === undefined) {
      if (node.children) {
        node.children.forEach((child) => {
          addNodeToGraph(child, node.id);
        });
      }
    } else if (node.isExpanded) {
      if (node.children) {
        node.children.forEach((child) => {
          addNodeToGraph(child, node.id);
        });
      }
    } else return;
  };

  data[0].children?.forEach((node) => {
    addNodeToGraph(node, null);
  });

  return { nodes, edges };
}
