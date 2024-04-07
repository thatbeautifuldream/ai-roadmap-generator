import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { availableModels, modelKeys } from "../../app/shared/constants";
import { UModel, useUIStore } from "@/lib/stores";

interface ModalSelectProps {
  disabled: boolean;
}

const ModelSelect = ({ disabled }: ModalSelectProps) => {
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
    <Select disabled={disabled} value={model} onValueChange={onValueChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
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
