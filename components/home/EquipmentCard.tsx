
interface EquipmentCardProps {
  image: string;
  title: string;
}

const EquipmentCard = ({ image, title }: EquipmentCardProps) => {
  return (
    <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] cursor-pointer">
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="border-b-[4px] border-primary p-5">
        <h3 className=" text-[20px] font-bold leading-[20px] text-[#22201C]">
          {title}
        </h3>

        <button
          type="button"
          className="mt-3 inline-flex items-center gap-[10px] text-base leading-none font-medium text-primary transition-all duration-300 hover:gap-3"
        >
          Browse Inventory
          
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.125 14.625L15.75 9L10.125 3.375M15.75 9H2.25" stroke="#F2671C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;