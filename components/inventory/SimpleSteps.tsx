import Image from "next/image";

function SimpleSteps() {
  const steps = [
    {
      title: "Explore the Equipment",
      desc: "Browse the listing, review specifications, images, and condition details to ensure the machine fits your requirements.",
      icon: "/assets/eq1.svg",
    },
    {
      title: "Bid or Buy Now",
      desc: "Place a bid through auction or choose the Buy Now option to secure the equipment instantly.",
      icon: "/assets/eq2.svg",
    },
    {
      title: "Order Confirmation",
      desc: "Once your bid is accepted or purchase is completed, you’ll receive an order summary and payment instructions.",
      icon: "/assets/eq3.svg",
    },
    {
      title: "Secure Payment",
      desc: "Complete the payment through our secure system. All transactions are protected and fully transparent.",
      icon: "/assets/eq4.svg",
    },
    {
      title: "Delivery & Collection",
      desc: "We coordinate delivery or pickup and keep you informed until the equipment reaches your location.",
      icon: "/assets/eq5.svg",
    },
  ];
  return (
    <section className="container-custom mx-auto my-20 lg:my-[110px]">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-[38px] font-bold text-[#1D1C1A]">
         Buy this <span className="text-green">equipment</span> in simple steps
        </h2>
        <p className="text-sm text-gray-500 mt-2">
         From selection to delivery, we guide you through a smooth and secure buying process.
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 lg:gap-10">
        <div className="col-span-12 lg:col-span-6">
          {/* MOBILE IMAGE (no fill) */}
          <div className="block lg:hidden mb-6">
            <Image
              src="/assets/how.png"
              alt="excavator"
              width={600}
              height={400}
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>

          {/* DESKTOP IMAGE (fill) */}
          <div className="hidden lg:block relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/assets/how.png"
              alt="excavator"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-2 sm:gap-5 items-start relative pb-11 md:pb-[60px] last:pb-0 md:min-h-[120px] last:min-h-0"
            >
              <div className="relative flex flex-col items-center shrink-0">
                <div
                  className="w-[55px] md:w-[70px] h-[55px] md:h-[70px] rounded-full bg-[#FFBD34] flex items-center justify-center relative"
                >
                  <div className="w-[28px] md:w-[32px] h-[28px] md:h-[32px] relative">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
                {index !== steps.length - 1 && (
                  <div className="absolute top-1/2 left-[28px] md:left-[35px] -translate-x-1/2 md:mt-1">
                    <Image
                      src="/assets/strechline-new.png"
                      alt="connector-line"
                      width={0}
                      height={57}
                    style={{ width: "auto", height: "57px" }}
                    priority
                    />
                  </div>
                )}

              {/* Content */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray mb-[10px]">
                  {step.title}
                </h3>
                <p className="text-text-gray text-base leading-[26px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SimpleSteps;
