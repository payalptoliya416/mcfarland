'use client'

import AboutUsHero from "@/components/about-us/AboutUsHero"
import OurCommentment from "@/components/about-us/OurCommentment"
import OurStory from "@/components/about-us/OurStory"
import TrustDriven from "@/components/about-us/TrustDriven"
import ChooseUs from "@/components/home/ChooseUs"
import FAQ from "@/components/home/FAQ"
import HowWork from "@/components/home/HowWork"
import Partner from "@/components/home/Partner"
import StatsSection from "@/components/inventory/StatsSection"

function AboutUs() {
  return (
    <>
    <AboutUsHero/>
    <OurStory/>
    <HowWork/>
    <ChooseUs/>
    <StatsSection/>
    <TrustDriven/>
    <OurCommentment/>
    <Partner/>
    <FAQ/>
    </>
  )
}

export default AboutUs
