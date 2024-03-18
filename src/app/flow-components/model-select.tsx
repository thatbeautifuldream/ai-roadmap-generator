import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UModel, useUIStore } from "../stores/useUI";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { availableModels, modelKeys } from "../shared/constants";

const ModelSelect = () => {
  const { setModel, model } = useUIStore(
    useShallow((state) => ({
      setModel: state.setModel,
      model: state.model,
    }))
  );
  const onValueChange = (val: string) => setModel(val as UModel);

  useEffect(() => {
    const modelKey = localStorage.getItem("model");
    const exist = modelKeys.find((key) => key === modelKey);
    if (exist && modelKey) {
      setModel(modelKey as UModel);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("model", model);
  }, [model]);

  return (
    <Select value={model} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model) => (
          <SelectItem key={model.key} value={model.key}>
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
