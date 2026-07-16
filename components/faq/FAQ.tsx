"use client";

function FaqHero() {
  return (
     <section className="p-5 -mt-[145px]  pb-0">
      <div
        className="relative rounded-3xl overflow-hidden min-h-[410px] bg-cover bg-center bg-[url(/assets/images/faq-bg.png)] flex justify-center items-center md:bg-[length:100%_100%] bg-no-repeat"
      >
        <div className="relative z-10 pt-[161px] min-h-[410px]">
          <div className="custom-container text-center text-white">
            <h1 className="mx-auto max-w-5xl text-center text-[28px] font-extrabold leading-[40px] sm:text-[42px] sm:leading-[52px] md:text-[48px] md:leading-[58px] lg:text-[60px] lg:leading-[72px] mb-5">
             Frequently{" "}
              <span className="text-primary">
                Asked Questions
              </span>{" "}
            </h1>

            <p className="mx-auto max-w-[790px] px-4 text-center text-sm font-medium leading-6 text-white sm:text-base sm:leading-[26px]">
            Find quick answers to the most common queries below — or reach out to our team anytime.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default FaqHero;
