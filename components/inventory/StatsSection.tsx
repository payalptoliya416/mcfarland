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
            const duration = 1500; // 1.5s
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
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-[#E9E9E940] py-12 md:py-[70px] w-full"
    >
      <div className="container-custom mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-8 px-4">

        {stats.map((stat, index) => (
          <div key={stat.id} className="flex flex-col items-center">
            <p className="text-4xl md:leading-[50px] md:text-[40px] font-bold text-gray mb-[15px] mont-text">
              {counts[index]}{stat.id === 1 ? "+" : ""}
            </p>
            <p className="text-para text-sm md:text-lg">
              {stat.label}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
