import type { Route } from "./+types/home";
import { MainLayout } from "../layouts/MainLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Showoff" },
    { name: "description", content: "Showoff!" },
  ];
}

export default function Login() {
  return <MainLayout />;
}
