import Image from "next/image";
import SimpleSteps from "../inventory/SimpleSteps";
function HowWork() {
  const stepsData = [
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
  const steps = [
    {
      title: "Browse Inventory",
      desc: "Explore our extensive collection of industrial machinery, farm tools, and equipment available for bidding.",
      icon: "/assets/icon5.svg",
    },
    {
      title: "Bid & Buy",
      desc: "Join live auctions or use the “Buy Now” option to secure high-quality equipment at competitive prices.",
      icon: "/assets/icon6.svg",
    },
    {
      title: "Track Order",
      desc: "Stay updated with real-time order tracking and delivery details until your purchased equipment safely arrives.",
      icon: "/assets/icon7.svg",
    },
  ];
  return (
    <>
      {/* <section className="container-custom mx-auto my-20 lg:my-[110px]">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-[38px] md:leading-[38px] mb-[15px] font-bold text-gray mont-text">
          How It <span className="text-orange">Works</span>
        </h2>
        <p className="text-base leading-[16px] text-text-gray">
          Simple Steps to Buy or Bid
        </p>
      </div>
      <div className="grid grid-cols-12 lg:gap-10 ">
        <div className="col-span-12 lg:col-span-6">
          <div className="block lg:hidden mb-6">
            <Image
              src="/assets/why3.png"
              alt="excavator"
              width={600}
              height={400}
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>

          <div className="hidden lg:block relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/assets/why3.png"
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
                <div className="w-[55px] md:w-[70px] h-[55px] md:h-[70px] rounded-full bg-[#FFAD01] flex items-center justify-center relative">
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
                    width={8}
                    height={50}
                    className="object-contain"
                  />
                </div>
              )}

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
      <div className="grid grid-cols-12 lg:gap-10">
        <div className="col-span-12 lg:col-span-6">
          <div className="block lg:hidden mb-6">
            <Image
              src="/assets/how.png"
              alt="excavator"
              width={600}
              height={400}
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>

          <div className="hidden lg:block relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/assets/how.png"
              alt="excavator"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section> */}
      <section className="container-custom mx-auto my-20 lg:my-[110px]">
         <div className="text-center mb-10">
        <h2 className="text-3xl md:text-[38px] md:leading-[38px] mb-[15px] font-bold text-gray mont-text">
          How It <span className="text-orange">Works</span>
        </h2>
        <p className="text-base leading-[16px] text-text-gray">
          Simple Steps to Buy or Bid
        </p>
      </div>
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 lg:gap-10">
            <div className="col-span-12 relative">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-10 md:gap-0">
                {stepsData.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex lg:flex-col items-start lg:items-center lg:text-center md:flex-1 gap-4 lg:gap-0 mb-10 lg:mb-0"
                  >
                    <div>
                      <div className="relative z-10 w-[55px] md:w-[70px] h-[55px] md:h-[70px] rounded-full bg-[#FFAD01] flex items-center justify-center">
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

                    {/* DOTTED LINE */}
                    {index !== stepsData.length - 1 && (
                      <div className="hidden md:block absolute top-[32px] left-[60%] xl:left-[76%] translate-x-[100%]">
                        <img
                          src="/assets/strechlin-new.png"
                          alt="connector-line"
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* CONTENT */}
                    <div className="lg:mt-4 px-2 lg:max-w-[240px]">
                      <h3 className="text-lg md:text-xl font-semibold text-gray mb-2">
                        {step.title}
                      </h3>
                      <p className="text-text-gray text-sm leading-6">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="block lg:hidden">
          <div className="grid grid-cols-12 lg:gap-10">
            <div className="col-span-12 lg:col-span-6 relative">
              {stepsData.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-2 sm:gap-5 items-start relative pb-11 md:pb-[60px] last:pb-0 md:min-h-[120px] last:min-h-0"
                >
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className="w-[55px] md:w-[70px] h-[55px] md:h-[70px] rounded-full bg-[#FFAD01] flex items-center justify-center relative">
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
                  {index !== stepsData.length - 1 && (
                  <div className="absolute top-[70px] md:top-[84px] left-[28px] md:left-[35px] -translate-x-1/2">
                    <img
                      src="/assets/strechline-new.png"
                      alt="connector-line"
                      className="object-contain"
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
        </div>
      </section>
    </>
  );
}

export default HowWork;
