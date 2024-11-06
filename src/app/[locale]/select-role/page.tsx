"use client";

import * as z from "zod";
import RoleSelectionCard from "@/components/auth/RoleSelectionCard";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateRoleSchema } from "@/schemas/auth-schemas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RoleCardWrapper from "@/components/auth/RoleCardWrapper";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export default function SelectRolePage() {
   const router = useRouter();

   const form = useForm<z.infer<typeof updateRoleSchema>>({
      resolver: zodResolver(updateRoleSchema),
      defaultValues: {
         role: "customer",
      },
   });

   const {
      formState: { isSubmitting },
   } = form;

   const onSubmit = async (values: z.infer<typeof updateRoleSchema>) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/users/role`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
            credentials: "include",
         });
         const data = await response.json();

         if (!data.ok) {
            toast.error(data.message);
         } else {
            toast(data.message);
            form.reset();
            if (data.role == "tenant") {
               router.push("/tenant");
            } else {
               router.push("/");
            }
            router.refresh();
         }
      } catch (error) {
         console.error(error);
         toast.error("Something went wrong!");
      }
   };

   return (
      <main className="flex h-full min-h-screen items-center justify-center overflow-y-auto px-4">
         <div className="h-full w-[375px] content-center self-center sm:w-[500px] lg:w-[900px]">
            <div className="h-fit w-full py-4">
               <RoleCardWrapper headerLabel="Selecting Role">
                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                        <FormField
                           control={form.control}
                           name="role"
                           render={({ field }) => (
                              <FormItem className="space-y-3 lg:space-y-6">
                                 <FormControl>
                                    <RadioGroup
                                       onValueChange={field.onChange}
                                       defaultValue={"customer"}
                                       className="flex flex-col space-y-1 lg:flex-row lg:gap-10"
                                    >
                                       <FormItem className="bg-card relative rounded-lg">
                                          <FormControl>
                                             <RadioGroupItem className="absolute left-4 top-6" value="customer" />
                                          </FormControl>
                                          <FormLabel>
                                             <RoleSelectionCard
                                                roleType={"Customer"}
                                                description={"As a customer, you could booked the listed properties"}
                                                roleImageUrl={"/illustration-customer.svg"}
                                             />
                                          </FormLabel>
                                       </FormItem>
                                       <FormItem className="bg-card relative rounded-lg">
                                          <FormControl>
                                             <RadioGroupItem className="absolute left-4 top-6" value="tenant" />
                                          </FormControl>
                                          <FormLabel>
                                             <RoleSelectionCard
                                                roleType={"Tenant"}
                                                description={"As a tenant, you could rent your properties to customers"}
                                                roleImageUrl={"/illustration-tenant.svg"}
                                             />
                                          </FormLabel>
                                       </FormItem>
                                    </RadioGroup>
                                 </FormControl>
                                 <FormMessage />
                                 <p className="text-muted-foreground text-sm">
                                    Note: You could not change your role in the future once you choose a role
                                 </p>
                              </FormItem>
                           )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                           Select Role
                        </Button>
                     </form>
                  </Form>
               </RoleCardWrapper>
            </div>
         </div>
      </main>
   );
}
