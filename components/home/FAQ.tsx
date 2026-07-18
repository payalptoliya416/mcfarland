"use client";

import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Item {
  id: number;
  question: string;
  answer: string;
}

function FAQ() {
  const { companyName } = useSettings();
   const [openId, setOpenId] = useState<number>(1);

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? 0 : id));
  };

const faqData: Item[] = [
  {
    id: 1,
    question: "How can I register for bidding?",
    answer:
      "You can easily register by creating an account on our website using your email or phone number. After quick verification, you'll unlock full access to our live auctions, bidding features, and exclusive equipment listings.",
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept secure wire transfers and bank transfers for all equipment purchases and auction transactions. All payments must be completed through official banking channels to ensure transparency, security, and full transaction documentation. Our team will provide detailed payment instructions once your purchase or winning bid is confirmed.",
  },
  {
    id: 3,
    question: "How is shipping handled after purchase?",
    answer:
      "We offer delivery across multiple regions with cost calculated based on location.",
  },
  {
    id: 4,
    question: "Can I inspect the equipment before buying or bidding?",
    answer:
      "Yes, inspections are available by appointment at our listed locations.",
  },
  {
    id: 5,
    question: "How can I sell my equipment on your platform?",
    answer:
      "Simply create a seller account, upload your equipment details, and list for buyers.",
  },
  {
    id: 6,
    question: "What happens if I win an auction?",
    answer:
      "You'll receive a confirmation email with payment and delivery instructions.",
  },
  {
    id: 7,
    question: "Do I need to create an account to buy equipment?",
    answer:
      "Yes, an account is required to ensure secure transactions.",
  },
  {
    id: 8,
    question: "How can I track my shipment?",
    answer:
      "You can track via your dashboard using the tracking number provided.",
  },
  {
    id: 9,
    question: "What if my machine arrives damaged?",
    answer:
      "Contact support immediately with photos and order details for assistance.",
  },
  {
    id: 10,
    question: "What types of equipment do you sell?",
    answer:
      "We sell construction machinery, loaders, excavators, and more.",
  },
  {
    id: 11,
    question: `Is ${companyName} an international company?`,
    answer:
      "Yes, we serve customers across multiple countries through our network.",
  },
  {
    id: 12,
    question: "How can I contact customer support?",
    answer:
      "Yes, we serve customers across multiple countries through our network.",
  },
];
 
  return (
   <section className="section-bottom">
    <div className="container-custom mx-auto lg:!max-w-[838px]">

        <h2 className="mx-auto text-center text-[30px] font-extrabold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[38px] lg:text-[42px] lg:leading-[40px]">
        Frequently{" "}
        <span className="text-primary">
            Asked Questions
        </span>
        </h2>
        {/* FAQ */}

        <div className="mt-10 space-y-5 lg:space-y-[31px]">

          {faqData.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                 className={`
                  overflow-hidden bg-white shadow-[0_2px_35px_rgba(0,0,0,0.08)]
                  cursor-pointer transition-all duration-300
                  ${
                    isOpen
                      ? "rounded-[20px] p-4 lg:p-[23px]"
                      : "rounded-full px-5 py-4 lg:px-[23px] lg:py-5"
                  }
                `}
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className="flex w-full items-center justify-between gap-5 text-left cursor-pointer"
                >
                  <span
                    className={`text-base lg:text-lg font-bold transition-colors ${
                      isOpen
                        ? "text-primary"
                        : "text-[#22201C]"
                    }`}
                  >
                    {item.question}
                  </span>

                  {isOpen ? (
                    <ChevronUp
                      size={22}
                      className="text-primary shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={22}
                      className="text-[#22201C] shrink-0"
                    />
                  )}
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-base font-medium leading-[26px] text-[#22201C] mt-[13px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default FAQ;
