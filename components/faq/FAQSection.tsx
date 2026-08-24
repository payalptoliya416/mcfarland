"use client";

import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection(): JSX.Element {
  const { companyName,settings } = useSettings();

  const faqs: FAQ[] = [
    {
      question: "How can I register for bidding?",
      answer:
        "You can easily register by creating an account on our website using your email or phone number. After quick verification, you'll unlock full access to our live auctions, bidding features, and exclusive equipment listings.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept secure wire transfers and bank transfers for all equipment purchases and auction transactions. All payments must be completed through official banking channels to ensure transparency, security, and full transaction documentation. Our team will provide detailed payment instructions once your purchase or winning bid is confirmed.",
    },
    {
      question: "How is shipping handled after purchase?",
      answer:
        "We offer delivery across multiple regions with cost calculated based on location.",
    },
    {
      question: "Can I inspect the equipment before buying or bidding?",
      answer:
        "Yes, inspections are available by appointment at our listed locations.",
    },
    {
      question: "How can I sell my equipment on your platform?",
      answer:
        "Simply create a seller account, upload your equipment details, and list for buyers.",
    },
    {
      question: "What happens if I win an auction?",
      answer:
        "You'll receive a confirmation email with payment and delivery instructions.",
    },
    {
      question: "Do I need to create an account to buy equipment?",
      answer: "Yes, an account is required to ensure secure transactions.",
    },
    {
      question: "How can I track my shipment?",
      answer: "You can track via your dashboard using the tracking number provided.",
    },
    {
      question: "What if my machine arrives damaged?",
      answer:
        "Contact support immediately with photos and order details for assistance.",
    },
    {
      question: "What types of equipment do you sell?",
      answer:
        "We sell construction machinery, loaders, excavators, and more.",
    },
    {
      question: `Is ${companyName} an international company?`,
      answer:
        "Yes, we serve customers across multiple countries through our network.",
    },
    {
      question: "How can I contact customer support?",
       answer: `You can contact our customer support team at ${
      settings?.phone_no || ""
    } or ${settings?.email || ""}.`,
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 80 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  } as const;


  return (
    <div className="container-custom section-space">
      <div className="w-full mx-auto max-w-[900px] space-y-[31px]">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <motion.div
              key={i}
              variants={itemVariant}
              className={`
              overflow-hidden bg-white shadow-[0_2px_35px_rgba(0,0,0,0.08)]
              p-4 lg:p-[23px] cursor-pointer transition-all duration-300
              ${isOpen ? "rounded-[20px]" : "rounded-full"}
            `}
            >
              {/* Question Button */}
              <button
                onClick={() => toggle(i)}
                className={`
              flex w-full items-center justify-between gap-5 text-left cursor-pointer
                `}
              >
                <span
                    className={`text-base lg:text-lg  font-bold transition-colors ${
                      isOpen
                        ? "text-primary"
                        : "text-[#22201C]"
                    }`}
                  >
                   {faq.question}
                  </span>
                <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0"
          >
            <ChevronDown
              size={22}
              className={isOpen ? "text-primary" : "text-[#22201C]"}
            />
          </motion.span>
              </button>

              {/* Answer Animation */}
             <AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        height: { duration: 0.35, ease: "easeInOut" },
        opacity: { duration: 0.25 },
      }}
      className="overflow-hidden"
    >
      <p className="mt-[13px] text-base font-medium leading-[26px] text-[#22201C]">
        {faq.answer}
      </p>
    </motion.div>
  )}
</AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
