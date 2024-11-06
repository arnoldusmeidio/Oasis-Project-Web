import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
   return (
      <div className="flex h-full content-center items-center self-center">
         <div className="flex h-fit flex-row items-center justify-center rounded-lg py-4 lg:w-[80vw] lg:justify-center lg:gap-6 lg:border-[1px] lg:p-6 lg:shadow-md xl:w-[75vw] 2xl:w-[50vw]">
            <figure className="bg-main-theme hidden w-[450px] items-center justify-center overflow-hidden rounded-full p-8 lg:flex">
               <Image
                  className="h-[350px] w-auto"
                  src={"/smartphone.svg"}
                  alt="Illustration of a person registering"
                  height={305}
                  width={264}
               />
            </figure>
            <div className="hidden h-[700px] border-[1px] px-0 lg:block"></div>
            <div className="w-[340px] px-4 sm:w-[500px]">
               <RegisterForm />
            </div>
         </div>
      </div>
   );
}
