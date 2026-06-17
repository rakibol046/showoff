import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login | ShowOff",
};

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 font-asul text-center">Welcome Back</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">Sign in to your account</p>
        <LoginForm />
      </div>
    </div>
  );
}
