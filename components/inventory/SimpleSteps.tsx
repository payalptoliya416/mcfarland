import Image from "next/image";

function SimpleSteps() {
const steps = [
  {
    icon: "/assets/images/step1.svg",
    number: "01",
    title: "Explore the Equipment",
    desc: "Browse the listing, review specifications, images, and condition details to ensure the machine fits your requirements.",
  },
  {
    icon: "/assets/images/step2.svg",
    number: "02",
    title: "Bid or Buy Now",
    desc: "Place a bid through auction or choose the Buy Now option to secure the equipment instantly.",
  },
  {
    icon: "/assets/images/step3.svg",
    number: "03",
    title: "Order Confirmation",
    desc: "Once your bid is accepted or purchase is completed, you'll receive an order summary and payment instructions.",
  },
  {
    icon: "/assets/images/step4.svg",
    number: "04",
    title: "Secure Payment",
    desc: "Complete the payment through our secure system. All transactions are protected and fully transparent.",
  },
  {
    icon: "/assets/images/step5.svg",
    number: "05",
    title: "Delivery & Collection",
    desc: "We coordinate delivery or pickup and keep you informed until the equipment reaches your location.",
  },
];
  return (
    <section className="container-custom mx-auto my-20 lg:my-[110px]">
      {/* Heading */}
      <div className="text-center mb-[50px]">
        <h2 className="mx-auto max-w-[860px] text-center text-[28px] font-bold leading-[40px] sm:text-[42px] sm:leading-[42px] mb-[15px]">
         Buy this <span className="text-green">equipment</span> in simple steps
        </h2>
        <p className="text-base text-para">
         From selection to delivery, we guide you through a smooth and secure buying process.
        </p>
      </div>

      {/* Layout */}
     <div className="container-custom">
     {/* Layout */}
<div className="space-y-6">
  {/* First Row */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {steps.slice(0, 3).map((step, index) => (
      <div
        key={index}
        className="relative overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_8px_35px_rgba(0,0,0,0.08)] min-h-[250px] hover:-translate-y-1 transition-all duration-300"
      >
        {/* Step Number */}
        <span className="absolute top-5 right-5 text-[70px] font-bold leading-none text-[#FCE1D2]/50">
          {step.number}
        </span>

        {/* Icon */}
        <div className="relative z-10 mb-[21px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#FCE1D2]/50">
          <Image
            src={step.icon}
            alt={step.title}
            width={32}
            height={32}
          />
        </div>

        {/* Content */}
        <h3 className="relative z-10 mb-[10px] text-lg font-bold text-lightblack">
          {step.title}
        </h3>

        <p className="relative z-10 text-base font-medium text-para">
          {step.desc}
        </p>
      </div>
    ))}
  </div>

  {/* Second Row */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:w-[66.666%] xl:mx-auto">
    {steps.slice(3).map((step, index) => (
      <div
        key={index + 3}
        className="relative overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_8px_35px_rgba(0,0,0,0.08)] min-h-[250px] hover:-translate-y-1 transition-all duration-300"
      >
        {/* Step Number */}
        <span className="absolute top-5 right-5 text-[70px] font-bold leading-none text-[#FCE1D2]/50">
          {step.number}
        </span>

        {/* Icon */}
        <div className="relative z-10 mb-[21px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#FCE1D2]/50">
          <Image
            src={step.icon}
            alt={step.title}
            width={32}
            height={32}
          />
        </div>

        {/* Content */}
        <h3 className="relative z-10 mb-[10px] text-lg font-bold text-lightblack">
          {step.title}
        </h3>

        <p className="relative z-10 text-base font-medium text-para">
          {step.desc}
        </p>
      </div>
    ))}
  </div>
</div>
     </div>
    </section>
  );
}

export default SimpleSteps;
