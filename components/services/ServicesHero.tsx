"use client";

function ServicesHero() {
  return (
   <section className="p-5 -mt-[116px] md:-mt-[145px] pb-0">
      <div
        className="relative rounded-3xl overflow-hidden min-h-[410px] bg-cover bg-center bg-[url(/assets/images/service.png)] flex justify-center items-center md:bg-[length:100%_100%] bg-no-repeat"
      >
        <div className="relative z-10 pt-[132px] md:pt-[127px] pb-14 md:pb-[67px]">
          <div className="container-custom text-center text-white">
            <h1 className="mx-auto max-w-5xl text-center text-[28px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5">
            Reliable Solutions for {" "}
              <span className="text-primary">
                 Buying and Selling
              </span>{" "} 
             Equipment
            </h1>

            <p className="mx-auto max-w-[700px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px]">
              We make machinery trading simple and secure offering trusted services for buying, selling, and transporting industrial machines worldwide.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ServicesHero;
