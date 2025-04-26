
import React from "react";
import LocalAiModels from "../LocalAiModels";
import type { LocalModel } from "./types";
import { toast } from "@/components/ui/use-toast";

interface ModelConnectionTabProps {
  onModelSelect: (model: LocalModel) => void;
}

export const ModelConnectionTab = ({ onModelSelect }: ModelConnectionTabProps) => {
  const handleModelSelect = (model: LocalModel) => {
    onModelSelect(model);
    toast({
      title: "Model selected",
      description: `${model.name} is now your active model for trading`,
    });
  };

  return <LocalAiModels onModelSelect={handleModelSelect} />;
};
