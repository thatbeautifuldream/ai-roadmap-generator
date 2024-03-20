import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/base.css";
import "reactflow/dist/style.css";
import { ContentNode } from "../shared/types/common";
import { Drawer } from "./drawer";
import ReactFlowPro from "./react-flow-pro";

type Props = {
  data: ContentNode[];
};

function ExpandCollapse(props: Props) {
  const { data } = props;

  return (
    <div className="w-full h-[93vh]">
      <ReactFlowProvider>
        <Drawer />
        <ReactFlowPro {...props} data={data} />
      </ReactFlowProvider>
    </div>
  );
}

export default ExpandCollapse;
