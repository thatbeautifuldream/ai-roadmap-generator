import { HierarchyNode, tree } from "d3-hierarchy";
import { Position } from "reactflow";

const layout = tree().nodeSize([70, 200]);
// const layout = tree().nodeSize([200, 70]);

export function getElements(h: HierarchyNode<unknown>) {
    const root = layout(h);

    const nodes = root.descendants().map((d: any, i) => ({
        id: d.id,
        data: { label: d.data.name, depth: d.depth },
        // position: { x: d.x, y: d.y },
        position: { x: d.y, y: d.x },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        // sourcePosition: Position.Bottom,
        // targetPosition: Position.Top,
        type: i === 0 ? "input" : d._children ? "default" : "output",
    }));

    const edges = root.links().map((d, i) => ({
        id: `${i}`,
        source: d.source.id || "",
        target: d.target.id || "",
    }));

    return { nodes, edges };
}