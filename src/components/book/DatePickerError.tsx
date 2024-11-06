import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface DatePickerErrorProps {
   message?: string;
}

export default function DatePickerError({ message }: DatePickerErrorProps) {
   if (!message) return null;

   return (
      <div className="bg-destructive/15 text-destructive flex items-center gap-x-2 rounded-md p-3 text-xs">
         <ExclamationTriangleIcon className="h-4 w-4" />
         <p>{message}</p>
      </div>
   );
}
