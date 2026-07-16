import Image from "next/image";

export interface ProcessItem {
  id: number;
  title: string;
  description: string;
}

function HowWork() {

  const processData: ProcessItem[] = [
  {
    id: 1,
    title: "Verified Equipment",
    description:
      "Every machine is thoroughly inspected and accurately listed, so you know exactly what you're buying.",
  },
  {
    id: 2,
    title: "Bid or Buy Now",
    description:
      "Place a bid through auction or choose the Buy Now option to secure the equipment instantly.",
  },
  {
    id: 3,
    title: "Order Confirmation",
    description:
      "Once your bid is accepted or purchase is completed, you'll receive an order summary and payment instructions.",
  },
  {
    id: 4,
    title: "Secure Payment",
    description:
      "Complete the payment through our secure system. All transactions are protected and fully transparent.",
  },
  {
    id: 5,
    title: "Delivery & Collection",
    description:
      "We coordinate delivery or pickup and keep you informed until the equipment reaches your location.",
  },
];

  return (
    <>
     <section className="section-space">
      <div className="bg-[#E9E9E9]/30 py-[70px]">
      <div className="container-custom">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-[30px]">
          <div>
            <span className="inline-flex rounded-full bg-[#F2671C] px-5 py-[10px] text-base !leading-[16px] font-semibold text-white">
              Process
            </span>

            <h2 className="mt-5 text-[30px] font-bold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[42px]">
              How It <span className="text-primary">Works</span>
            </h2>

            <img
              src='/assets/images/how-work.png'
              alt="Process"
              className="mt-[30px] w-full"
            />
          </div>

          <div className="flex flex-col">
            {processData.map((item) => (
              <div
                key={item.id}
               className="flex gap-[30px] border-b border-[#D3D2D2] py-5 lg:py-[30px] first:pt-0 last:pb-0 last:border-none"
              >
                <div>
                  <h3 className="text-3xl xl:text-[44px] font-semibold leading-none text-[#22201C]">
                    {item.id.toString().padStart(2, "0")}.
                  </h3>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-[#22201C]">
                    {item.title}
                  </h4>

                  <p className="mt-[10px] text-base leading-[26px] text-[#4B4947] font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
    </>
  );
}

export default HowWork;
