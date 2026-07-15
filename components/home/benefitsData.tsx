


export interface BenefitItem {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  imagePosition: "left" | "right";
}

export const benefitsData: BenefitItem[] = [
  {
    id: 1,
    title: "Secure & Transparent Payments",
    description:
      "Secure payment processing, transparent pricing, and comprehensive documentation ensure every transaction is safe, reliable, straightforward, giving buyers complete confidence throughout purchasing.",
    image: '/assets/images/buyer1.png',
    icon: '/assets/images/buyer-icon1.svg',
    imagePosition: "right",
  },
  {
    id: 2,
    title: "Fully Inspected Equipment",
    description:
      "Detailed equipment listings include clear photos, accurate condition reports, and essential specifications, helping buyers evaluate machinery confidently and make informed purchasing decisions.",
    image: '/assets/images/buyer2.png',
    icon: '/assets/images/buyer-icon2.svg',
    imagePosition: "left",
  },
  {
    id: 3,
    title: "Delivered to Your Location",
    description:
      "We manage transportation and logistics from pickup to delivery, ensuring your equipment reaches its destination safely, efficiently, and on schedule every time.",
    image: '/assets/images/buyer3.png',
    icon: '/assets/images/buyer-icon3.svg',
    imagePosition: "right",
  },
];