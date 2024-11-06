export default function AuthLayout({ children }: { children: React.ReactNode }) {
   return <main className="flex h-full min-h-screen items-center justify-center overflow-y-auto px-4">{children}</main>;
}
