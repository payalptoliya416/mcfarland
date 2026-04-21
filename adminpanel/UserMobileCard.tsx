"use client";

import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import UserStatusDropdown from "@/adminpanel/UserStatusDropdown";
import { BiEdit } from "react-icons/bi";
import { HiArrowPath } from "react-icons/hi2";

type Props = {
  user: any;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onUpdated: () => void;
    loadingAction: {
    id: number | null;
    type: "view" | "edit" | null;
  };
};

export default function UserMobileCard({
  user,
  onEdit,
  onView,
  onDelete,
  onUpdated,
  loadingAction,
}: Props) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-4">
      {/* Name + Status */}
      <div className="flex justify-between items-start gap-1">
          <div className="min-w-0">
    <p className="font-semibold break-words">{user.name}</p>
    <p className="text-xs text-gray-500 break-words">{user.email}</p>
  </div>

        <UserStatusDropdown
          value={user.status_text}
          userId={user.id}
          onUpdated={onUpdated}
        />
      </div>

      <div className="text-sm space-y-1">
        <Row label="Phone" value={user.phone} />
        <Row label="Registered" value={user.date} />
        <Row label="License" value={user.license_status_text ?? "No License"} />
      </div>

      {/* Actions */}
       <div className="flex justify-end gap-4 pt-4 border-t border-border">

  {/* VIEW */}
  <button
    disabled={loadingAction.id === user.id && loadingAction.type === "view"}
    onClick={onView}
    className="flex items-center justify-center rounded-full text-blue-500"
  >
    {loadingAction.id === user.id && loadingAction.type === "view" ? (
      <HiArrowPath size={18} className="animate-spin" />
    ) : (
      <HiOutlineEye size={18} />
    )}
  </button>

  {/* EDIT */}
  <button
    disabled={loadingAction.id === user.id && loadingAction.type === "edit"}
    onClick={onEdit}
    className="flex items-center justify-center rounded-full text-yellow-500"
  >
    {loadingAction.id === user.id && loadingAction.type === "edit" ? (
      <HiArrowPath size={18} className="animate-spin" />
    ) : (
      <BiEdit size={18} />
    )}
  </button>

  {/* DELETE */}
  <button
    onClick={onDelete}
    className="flex items-center justify-center rounded-full text-red-500"
  >
    <HiOutlineTrash size={18} />
  </button>
</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full
        ${danger ? "text-red-500 hover:bg-red-50" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}
