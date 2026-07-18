import Image from "next/image";

interface AdvantageCardProps {
  icon: string;
  title: string;
  description: string;
}

const AdvantageCard = ({ icon, title, description }: AdvantageCardProps) => {
  return (
    <div
      className="relative overflow-hidden rounded-[20px] p-5 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: `url(/assets/images/why-list-bg.png) center / 100% 100% no-repeat`,
      }}
    >
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#F2671C1A]">
        <Image
          src={icon}
          alt={title}
          width={24}
          height={24}
          unoptimized
          className="h-6 w-6 object-contain"
        />
      </div>

      <h3 className="mt-[18px] text-lg font-semibold text-white">{title}</h3>

      <p className="mt-[10px] text-base leading-[26px] text-[#BDBDBB]">
        {description}
      </p>
    </div>
  );
};

export default AdvantageCard;
