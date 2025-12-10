import Image from "next/image";

import Slider from "@/components/home/slider";
import NewArrival from "@/components/home/new-arrival";
import { getSlider } from "@/features/api/sliderApi";

export default async function Home() {
  const sliders = await getSlider();
  console.log("Slider : ", sliders);
  return (
    <div>
      {sliders && <Slider sliders={sliders} />}

      <NewArrival />
    </div>
  );
}
