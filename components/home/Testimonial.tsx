"use client";

import Image from "next/image";

function Testimonial() {
  return (
    <section>
      <div className="container-custom mx-auto ">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[#F2671C] px-5 py-[10px] text-base !leading-[16px] font-semibold text-white">
            Testimonial
          </span>
          {/* Heading */}
          <h2 className="mt-[30px] text-[30px] font-bold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[42px]">
            What <span className="text-orange">Our Clients</span> Say ?
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-0 mt-10 items-stretch">
          {/* Card 1 */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 flex bg-[url('/assets/images/testimonial-bg1.png')] bg-no-repeat bg-center bg-[length:100%_100%] min-h-[387px] h-full w-[105%]">
            <div className="px-[30px] pt-[30px] pb-[102px] w-full relative flex flex-col">
              <div className="m-7">
                <Image
                  src="/assets/images/invert.png"
                  alt="Quote"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="mb-5 w-[50px] h-auto"
                />

                <p className="text-lg text-[#4B4947] leading-[28px] font-semibold flex-1">
                  “Selling my machinery through Eastline Equipment Auctions was
                  seamless. Their team handled everything professionally, and I
                  received great value within days. Highly recommended!”
                </p>
              </div>

              <div className="absolute bottom-5 xl:bottom-7 left-8 xl:left-7 flex items-center gap-[10px]">
                <Image
                  src="/assets/images/client1.png"
                  alt="Robert F"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />

                <div>
                  <h4 className="text-primary text-base md:text-lg leading-none font-semibold mb-2">
                    Robert F
                  </h4>

                  <p className="text-[#4B4947] text-sm md:text-base font-medium leading-none">
                    Supplier
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 flex bg-[url('/assets/images/testimonial-bg1.png')] bg-no-repeat bg-center bg-[length:100%_100%] min-h-[387px] h-full w-[105%]">
            <div className=" px-[30px] pt-[30px] pb-[102px] w-full relative flex flex-col">
              <div className="m-7">
                <Image
                  src="/assets/images/invert.png"
                  alt="Quote"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="mb-5 w-[48px] h-auto"
                />

                <p className="text-lg text-[#4B4947] leading-[28px] font-semibold flex-1">
                  “Fantastic experience from start to finish! The website is
                  easy to use, and the support team helped me find the perfect
                  excavator within my budget.”
                </p>
              </div>

              <div className="absolute bottom-5 xl:bottom-7 left-8 xl:left-7 flex items-center gap-[10px]">
                <Image
                  src="/assets/images/client2.png"
                  alt="Kathryn M"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />

                <div>
                  <h4 className="text-primary text-base md:text-lg leading-none font-semibold mb-2">
                    Kathryn M
                  </h4>

                  <p className="text-[#4B4947] text-sm md:text-base font-medium leading-none">
                    Dealer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-12 md:col-span-6 xl:col-span-4 flex bg-[url('/assets/images/testimonial-bg1.png')] bg-no-repeat bg-center bg-[length:100%_100%] min-h-[387px] h-full w-[105%]">
            <div className="px-[30px] pt-[30px] pb-[102px] w-full relative flex flex-col">
              <div className="m-7">
                <Image
                  src="/assets/images/invert.png"
                  alt="Quote"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="mb-5 w-[48px] h-auto"
                />

                <p className="text-lg text-[#4B4947] leading-[28px] font-semibold flex-1">
                  “I participated in my first online auction with Eastline
                  Equipment Auctions, and it was incredibly smooth, transparent,
                  and secure. Highly trustworthy and efficient service!”
                </p>
              </div>

              <div className="absolute bottom-5 xl:bottom-7 left-8 xl:left-7 flex items-center gap-[10px]">
                <Image
                  src="/assets/images/client3.png"
                  alt="Jerome B"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />

                <div>
                  <h4 className="text-primary text-base md:text-lg leading-none font-semibold mb-2">
                    Jerome B
                  </h4>

                  <p className="text-[#4B4947] text-sm md:text-base font-medium leading-none">
                    Owner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
