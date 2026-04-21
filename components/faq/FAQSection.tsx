"use client";

import { JSX, useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { BiPlus } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection(): JSX.Element {
  const { companyName } = useSettings();

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
      answer:
        "Yes, we serve customers across multiple countries through our network.",
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
    <div className="container-custom">
      <motion.div
        className="w-full max-w-[900px] mx-auto my-20 lg:my-[110px]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <motion.div
              key={i}
              variants={itemVariant}
              className="mb-4"
            >
              {/* Question Button */}
              <button
                onClick={() => toggle(i)}
                className={`
                  w-full flex justify-between items-center px-5 py-4 rounded-xl border cursor-pointer
                  transition-all text-left font-semibold text-lg mont-text
                  ${isOpen
                    ? "bg-green text-white border-green"
                    : "bg-white text-gray border-gray-300"
                  }
                `}
              >
                {faq.question}

                {/* Icon Animation */}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <FaMinus className="text-white" size={18} />
                  ) : (
                    <BiPlus className="text-gray" size={22} />
                  )}
                </motion.span>
              </button>

              {/* Answer Animation */}
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-text-gray bg-white rounded-b-xl text-base leading-[26px]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
