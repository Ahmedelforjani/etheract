import { Loader2Icon } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex items-center justify-center">
      <Loader2Icon className="animate-spin text-primary" size={48} />
    </div>
  );
}
