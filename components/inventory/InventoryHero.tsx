"use client";

function InventoryHero() {
  return (
        <section className="p-5 -mt-[145px] pb-0">
      <div
        className="relative rounded-3xl overflow-hidden min-h-[410px] bg-cover bg-center bg-[url(/assets/images/about-hero.png)] flex justify-center items-center md:bg-[length:100%_100%] bg-no-repeat"
      >
        <div className="relative z-10 pt-[132px] md:pt-[127px] pb-14 md:pb-[67px]">
          <div className="container-custom text-center text-white">
            <h1 className="mx-auto max-w-[860px] text-center text-[28px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5">
            Discover {" "}
              <span className="text-primary">
                Quality Machinery
              </span>{" "} 
             for Every Need
            </h1>

            <p className="mx-auto max-w-[740px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px]">
             Browse a wide selection of used and new industrial machinery, tractors, tools, and equipment.Filter by category, make, model, or year  and find the right machine for your business.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default InventoryHero;
