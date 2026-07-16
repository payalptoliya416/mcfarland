'use client';

import { JSX, useEffect, useRef, useState } from 'react';

interface StatItem {
  id: number;
  value: number;
  label: string;
}

const stats: StatItem[] = [
  { id: 1, value: 500, label: "Happy Clients every year" },
  { id: 2, value: 150, label: "New Users every month" },
  { id: 3, value: 35, label: "New Listings every week" },
  { id: 4, value: 0, label: "Issues Reported so far" },
];

export default function StatsSection(): JSX.Element {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          stats.forEach((stat, index) => {
            let start = 0;
            const end = stat.value;
            const duration = 1500;
            const increment = end / (duration / 20);

            const counter = setInterval(() => {
              start += increment;

              if (start >= end) {
                start = end;
                clearInterval(counter);
              }

              setCounts((prev) => {
                const updated = [...prev];
                updated[index] = Math.floor(start);
                return updated;
              });
            }, 20);
          });
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="container-custom section-bottom">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[19px]">

        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="relative overflow-hidden rounded-[20px] bg-white px-5 lg:px-[25px] py-6 lg:py-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
          >
            {/* Top Right Circle */}
            <div className="absolute -top-11 -right-11 h-[124px] w-[124px] rounded-full bg-[#FFF3EC]" />

            <div className="relative z-10">
              <h3 className="text-3xl sm:text-[50px] leading-none font-bold text-lightblack">
                {counts[index]}
                {stat.id === 1 && "+"}
              </h3>

              <div className="mt-[15px] mb-[15px] h-[3px] w-10 rounded-full bg-primary" />

              <p className="text-base leading-[16px] text-para">
                {stat.label}
              </p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}