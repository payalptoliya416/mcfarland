'use client'

import AboutUsHero from "@/components/about-us/AboutUsHero";
import { useSettings } from "@/contexts/SettingsContext";



function TermsCondition() {
    const { companyName } = useSettings();
    const termsData = [
  {
    title: "15. Contact Information",
    desc: [
      `If you have any questions regarding these Terms & Conditions, you may contact ${companyName}, LLC at:`,
      `Registered Address: 529 BROOKSIDE AVENUE, REDLANDS, CA 92373.`,
      `Reg nº: 201702410607.`,
      `You may also contact us through the Contact Us page on this website.`,
    ],
  },
  {
    title: "2. User Eligibility",
    desc: [
      "Users must be at least 18 years of age to use this website.",
      "By using this website, you confirm that all information provided by you is accurate, complete, and current.",
    ],
  },
  {
    title: "3. Account Registration",
    desc: [
      "Certain features may require users to create an account.",
      "You are responsible for maintaining the confidentiality of your login credentials.",
      "Any activity conducted through your account will be deemed your responsibility.",
    ],
  },
  {
    title: "4. Equipment Listings & Information",
    desc: [
      "All machinery and equipment details are provided by sellers.",
      "We do not guarantee the accuracy, condition, quality, or performance of any listed equipment.",
      "Buyers are encouraged to inspect equipment before purchase.",
      "Images shown are for reference purposes only.",
    ],
  },
  {
    title: "5. Buying & Auction Rules",
    desc: [
      `All "Buy Now" and auction bids are legally binding.`,
      "Once an auction is won, the buyer is obligated to complete the payment.",
      "Bids cannot be withdrawn after submission.",
      "All sales are final unless explicitly stated otherwise.",
    ],
  },
  {
    title: "6. Payments",
    desc: [
      "Payments must be made using approved payment methods.",
      "Ownership transfer and delivery will only proceed after full payment is received.",
      "Any applicable taxes, duties, or additional charges are the buyer's responsibility.",
    ],
  },
  {
    title: "7. Shipping & Delivery",
    desc: [
      "Shipping costs and delivery timelines vary based on location, equipment type, and seller.",
      "We are not responsible for delays or damages caused during transportation unless otherwise agreed in writing.",
    ],
  },
  {
    title: "8. Cancellations & Refunds",
    desc: [
      "Auction purchases cannot be cancelled after winning a bid.",
      "Refunds (if applicable) are subject to the seller's refund policy.",
      "Any disputes must be resolved directly between the buyer and seller.",
    ],
  },
  {
    title: "9. Intellectual Property",
    desc: [
      "All website content, including text, images, logos, and design, is the intellectual property of the website owner.",
      "Unauthorized use, reproduction, or distribution is strictly prohibited.",
    ],
  },
  {
    title: "10. Prohibited Activities",
    list: [
      "Provide false or misleading information",
      "Engage in fraudulent or illegal activities",
      "Attempt to damage, hack, or disrupt website functionality",
      "Misuse the platform for unauthorized purposes",
    ],
  },
  {
    title: "11. Limitation of Liability",
    desc: [
      "Use of this website is at your own risk.",
      "We shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or listed equipment.",
    ],
  },
  {
    title: "12. Third-Party Links",
    desc: [
      "This website may contain links to third-party websites. We are not responsible for their content, policies, or services.",
    ],
  },
  {
    title: "13. Modifications to Terms",
    desc: [
      "We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on the website.",
    ],
  },
  {
    title: "14. Governing Law",
    desc: [
      "These Terms & Conditions shall be governed and interpreted in accordance with the applicable local laws.",
    ],
  },
  {
    title: "15. Contact Information",
    desc: [
      "For any questions regarding these Terms & Conditions, please contact us through the Contact Us page on this website.",
    ],
  },
];
  return (
    <>
      <AboutUsHero />

      <section className="my-10 lg:my-[120px]">
        <div className="container-custom mx-auto px-4 flex justify-center">
          <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 lg:p-14">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
              Terms & Conditions
            </h1>

            {/* Intro */}
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
              Please read these Terms & Conditions carefully before using this
              website. This website is owned and operated by{" "}
              <strong> {companyName}, LLC</strong>, Reg nº: (201702410607),
              Reg Address: 529 BROOKSIDE AVENUE, REDLANDS, CA 92373.
            </p>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-10">
              By accessing or using this website, you agree to be bound by these
              Terms & Conditions.
            </p>

            {/* Terms Sections */}
            <div className="space-y-10">
              {termsData.map((item, index) => (
                <div key={index}>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h2>

                  {/* Paragraphs */}
                  {item.desc &&
                    item.desc.map((text, i) => (
                      <p
                        key={i}
                        className="text-gray-700 text-sm sm:text-base leading-relaxed mt-2"
                      >
                        {text}
                      </p>
                    ))}

                  {/* List */}
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

export default TermsCondition;
