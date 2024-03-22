import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <Loader className="animate-spin" size={32} strokeWidth={3} color="gray" />
    </div>
  );
};

export default Loading;
