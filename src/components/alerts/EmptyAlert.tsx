import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EmptyAlertProps {
  description?: string;
}

export function EmptyAlert({
  description = `There is nothing here! Try clicking the "Generate" button to add some items.`,
}: EmptyAlertProps) {
  return (
    <Alert className="min-w-[55vw] mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Oops</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
