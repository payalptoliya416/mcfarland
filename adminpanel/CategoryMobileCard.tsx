"use client";

import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import { HiArrowPath } from "react-icons/hi2";

type Props = {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
  loadingEditId?: number | null;
};

export default function CategoryMobileCard({
  item,
  onEdit,
  onDelete,
  loadingEditId,
}: Props) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        {item.image_urls ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <Image
              src={item.image_urls}
              alt={item.categoryName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100" />
        )}

        <div className="flex-1">
          <p className="font-semibold text-sm">{item.categoryName}</p>
        </div>
      </div>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="Created" value={item.createdDate} />
        <Info label="Updated" value={item.lastUpdated} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 pt-3 border-t border-border">
        <button
          disabled={loadingEditId === item.id}
          onClick={onEdit}
          className="flex items-center justify-center rounded-full"
        >
          {loadingEditId === item.id ? (
            <HiArrowPath size={18} className="text-[#EDB423] animate-spin" />
          ) : (
            <BiEdit size={18} className="text-[#EDB423]" />
          )}
        </button>
        <HiOutlineTrash
          className="text-red-500 cursor-pointer"
          size={18}
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
