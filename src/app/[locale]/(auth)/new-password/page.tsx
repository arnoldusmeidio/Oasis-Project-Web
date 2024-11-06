import NewPasswordForm from "@/components/auth/NewPasswordForm";

export default function NewPassword() {
   return (
      <div className="h-full w-[375px] content-center self-center sm:w-[500px]">
         <div className="w-full py-4">
            <NewPasswordForm />
         </div>
      </div>
   );
}
