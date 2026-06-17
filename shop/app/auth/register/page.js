import RegisterForm from "@/components/auth/register-form";

export const metadata = {
  title: "Register | ShowOff",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 font-asul text-center">Create Account</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">Join us and start shopping</p>
        <RegisterForm />
      </div>
    </div>
  );
}
