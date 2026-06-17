"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerCustomer } from "@/api/auth.api";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await registerCustomer(form);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      router.push("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-zinc-900 border rounded-xl p-8 shadow-sm">
      <div className="space-y-1">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Min 6 characters" minLength={6} />
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-3">{error}</p>}

      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
