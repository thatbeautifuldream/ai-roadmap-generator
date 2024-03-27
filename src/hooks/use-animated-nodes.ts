// import { timer } from "d3-timer";
// import { useEffect, useState } from "react";
// import { useReactFlow } from "reactflow";

// const defaultOptions = { duration: 500 };

// function useAnimatedNodes(defaultNodes: any, options = defaultOptions) {
//     const [targetNodes, setTargetNodes] = useState(defaultNodes);
//     const [nodes, setNodes] = useState(defaultNodes);
//     const { getNode } = useReactFlow();

//     useEffect(() => {
//         const transitions = targetNodes.map((node: any) => {
//             return {
//                 id: node.id,
//                 from: getNode(node.id)?.position || node.position,
//                 to: node.position,
//                 node,
//             };
//         });

//         const t = timer((elapsed: number) => {
//             const s = elapsed / options.duration;

//             const currNodes = transitions.map(({ node, from, to }: any) => {
//                 return {
//                     ...node,
//                     position: {
//                         x: from.x + (to.x - from.x) * s,
//                         y: from.y + (to.y - from.y) * s,
//                     },
//                 };
//             });

//             setNodes(currNodes);

//             if (elapsed > options.duration) {
//                 t.stop();
//             }
//         });

//         return () => t.stop();
//     }, [getNode, targetNodes, options.duration]);

//     return [nodes, setTargetNodes];
// }

// export default useAnimatedNodes;

export const x = 7;