import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EmptyAlertProps {
  description?: string;
  title?: string;
}

export function EmptyAlert({
  title = "No items found",
  description = `There is nothing here! Try clicking the "Generate" button to add some items.`,
}: EmptyAlertProps) {
  return (
    <Alert className="min-w-[55vw] mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <AlertTitle>{title}</AlertTitle>
        {description}
      </AlertDescription>
    </Alert>
  );
}
