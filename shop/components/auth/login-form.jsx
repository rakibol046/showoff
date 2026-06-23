"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginCustomer } from "@/api/auth.api";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await loginCustomer(form);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      router.push("/");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-zinc-900 border rounded-xl p-8 shadow-sm">
      <div className="space-y-1">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-3">{error}</p>}

      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium underline underline-offset-4">
          Register
        </Link>
      </p>
    </form>
  );
}
