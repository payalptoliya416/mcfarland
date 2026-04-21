"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSettingsByKeysFooter } from "@/api/categoryActions";

function Location() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSettingsByKeysFooter().then((res) => {
      if (res.success) {
        setSettings(res.data);
      }
    });
  }, []);

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  const containerVariant = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  } as const;

  if (!settings) return null;

  const phone = settings.phone_no?.replace(/^(\+?1)/, "");
  const email = settings.email;

  const locations = [
    {
      icon: "/assets/l1.svg",
      title: "Office Address",
      desc: `${settings.company_name} ${settings.address}`,
    },
    {
      icon: "/assets/l2.svg",
      title: "Phone Number",
      desc: settings.phone_no,
    },
    {
      icon: "/assets/l3.svg",
      title: "Email Address",
      desc: settings.email,
    },
  ];
  
  return (
    <>
      <section className="my-20 lg:my-[110px]">
        <div className="container-custom mx-auto">
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px] items-stretch"
          >
            {locations.map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className="h-full flex justify-start items-center flex-col border border-border rounded-xl p-[30px] text-center bg-white"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-[70px] h-[70px] rounded-[10px] flex justify-center items-center mb-[20px] bg-green"
                >
                  <Image src={item.icon} alt="icon" width={36} height={36} />
                </motion.div>

                <h3 className="text-gray mb-[10px] text-xl leading-[20px] font-semibold mont-text">
                  {item.title}
                </h3>

                <p className="text-text-gray text-base font-normal">
                  {item.title === "Office Address" ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        settings.address ?? "",
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green transition"
                    >
                      {item.desc}
                    </a>
                  ) : item.title === "Phone Number" ? (
                    <a
                      href={`tel:${phone}`}
                      className="hover:text-green transition"
                    >
                      {phone}
                    </a>
                  ) : item.title === "Email Address" ? (
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-green transition"
                    >
                      {email}
                    </a>
                  ) : (
                    item.desc
                  )}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Location;
