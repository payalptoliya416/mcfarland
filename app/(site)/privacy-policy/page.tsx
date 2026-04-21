'use client';

import AboutUsHero from "@/components/about-us/AboutUsHero";
import { useSettings } from "@/contexts/SettingsContext";

function PrivacyPolicy() {
  const { companyName } = useSettings();

  const privacyData = [
  {
    title: "1. Introduction",
    desc: [
      `This Privacy Policy explains how ${companyName}, LLC (Reg nº: 201702410607), having its registered address at 529 BROOKSIDE AVENUE, REDLANDS, CA 92373 (“Company”, “we”, “our”, or “us”) collects, uses, discloses, and safeguards your information when you use our website.`,
      "By accessing or using our website, you agree to the terms of this Privacy Policy.",
    ],
  },
  {
    title: "2. Information We Collect",
    desc: [
      "We may collect personal and non-personal information from users including but not limited to:",
    ],
    list: [
      "Full name",
      "Email address",
      "Phone number",
      "Billing and shipping address",
      "Company details (if applicable)",
      "Payment information",
      "Government identification (if required for verification)",
    ],
  },
  {
    title: "3. How We Use Your Information",
    desc: ["We may use the information we collect for the following purposes:"],
    list: [
      "To create and manage user accounts",
      "To process purchases, bids, and payments",
      "To verify identity and prevent fraud",
      "To improve website functionality and user experience",
      "To communicate order updates and auction results",
    ],
  },
  {
    title: "4. Sharing of Information",
    desc: ["We may share your information in the following situations:"],
    list: [
      "With sellers and buyers to complete transactions",
      "With payment processors for secure payment handling",
      "With logistics providers for shipping and delivery",
      "When required by law or government authorities",
      "To protect our legal rights and prevent fraud",
    ],
  },
  {
    title: "5. Cookies & Tracking Technologies",
    desc: [
      "Our website may use cookies and similar tracking technologies to enhance user experience, analyze website traffic, and remember user preferences.",
      "You may disable cookies through your browser settings, but some features of the website may not function properly.",
    ],
  },
  {
    title: "6. Data Security",
    desc: [
      "We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, misuse, or disclosure.",
      "However, no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "7. Data Retention",
    desc: [
      "We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including legal, accounting, and reporting requirements.",
    ],
  },
  {
    title: "8. Your Rights",
    desc: ["Depending on your jurisdiction, you may have the right to:"],
    list: [
      "Access your personal information",
      "Request correction of inaccurate data",
      "Request deletion of your data",
      "Object to certain processing activities",
      "Withdraw consent where applicable",
    ],
  },
  {
    title: "9. Third-Party Links",
    desc: [
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.",
    ],
  },
  {
    title: "10 Changes to This Privacy Policy",
    desc: [
      "We reserve the right to update this Privacy Policy at any time. Changes will become effective immediately upon posting on the website.",
    ],
  },
  {
    title: "11. Contact Information",
    desc: [
      "If you have any questions about this Privacy Policy, you may contact:",
      `${companyName}, LLC`,
      "Reg nº: 201702410607",
      "529 BROOKSIDE AVENUE",
      "REDLANDS, CA 92373",
      "You may also contact us through the Contact Us page on this website.",
    ],
  },
  ];

  return (
    <>
      <AboutUsHero />

      <section className="my-10 lg:my-[120px]">
        <div className="container-custom mx-auto px-4 flex justify-center">
          <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 lg:p-14">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
              Privacy Policy
            </h1>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-10">
              This Privacy Policy explains how we collect, use, and protect your
              information when you use our website.
            </p>

            <div className="space-y-10">
              {privacyData.map((item, index) => (
                <div key={index}>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h2>

                  {item.desc &&
                    item.desc.map((text, i) => (
                      <p
                        key={i}
                        className="text-gray-700 text-sm sm:text-base leading-relaxed mt-2"
                      >
                        {text}
                      </p>
                    ))}

                  {item.list && (
                    <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700 text-sm sm:text-base">
                      {item.list.map((li, i) => (
                        <li key={i}>{li}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicy;
