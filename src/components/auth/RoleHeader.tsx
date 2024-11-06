interface HeaderProps {
   label: string;
}

export default function RoleHeader({ label }: HeaderProps) {
   return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
         <div className="flex flex-col items-center justify-center">
            <h1 className="font-montserrat text-foreground text-4xl font-semibold">{label}</h1>
         </div>
      </div>
   );
}
