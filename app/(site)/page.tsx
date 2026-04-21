'use client'

import AboutUs from "@/components/home/AboutUs";
import ChooseUs from "@/components/home/ChooseUs";
import Equipment from "@/components/home/Equipment";
import FAQ from "@/components/home/FAQ";
import Hero from "@/components/home/Hero";
import HowWork from "@/components/home/HowWork";
import Partner from "@/components/home/Partner";
import Testimonial from "@/components/home/Testimonial";
import WhyBuy from "@/components/home/WhyBuy";

export default function Home() {

  return (
    <>
       <Hero/>
       <AboutUs/>
       <Equipment/>
       <ChooseUs/>
       <WhyBuy/>
       <HowWork/>
       <Testimonial/>
       <Partner/>
       <FAQ/>
    </>
  );
}
