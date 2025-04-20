import Image from "next/image";

import Slider from "@/components/home/slider";
import NewArrival from "@/components/home/new-arrival";
export default function Home() {
  return (
    <div>
      <Slider />

      <NewArrival />
    </div>
  );
}
