interface EmptyAlertProps {
  description?: string;
  title?: string;
}

export function EmptyAlert({ title, description }: EmptyAlertProps) {
  return (
    <div className="text-center ">
      <h3 className="mt-2 text-md font-semibold text-red-600">{title}</h3>
      <p className="mt-1 text-sm text-red-400">{description}</p>
    </div>
  );
}
