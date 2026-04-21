"use client";

import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaMinus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/contexts/SettingsContext";

interface Item {
  question: string;
  answer: string;
}

function FAQ() {
  const { companyName } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs: Item[] = [
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
 
  return (
    <div className="container-custom mx-auto">
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-[38px] md:leading-[38px] mb-[15px] font-bold text-gray mont-text"
        >
          Frequently Asked <span className="text-orange">Questions</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-12 w-full justify-center items-center">
        <div className="space-y-4 col-span-10 col-start-2">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={`w-full flex items-center justify-between rounded-xl border border-border px-[22px] py-5 text-left font-semibold text-[16px] gap-2 md:gap-0 transition-all mont-text cursor-pointer
                    ${isOpen ? "bg-green text-white" : "bg-white text-gray"}
                  `}
                >
                  {item.question}

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? (
                      <FaMinus size={20} className="text-white" />
                    ) : (
                      <BiPlus size={20} className="text-gray0" />
                    )}
                  </motion.div>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {isOpen && item.answer !== "" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45 , ease: "easeInOut"}}
                      className="px-6 py-4 bg-white text-text-gray text-[15px] overflow-hidden"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
