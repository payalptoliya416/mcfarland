type Props = {
  row: any;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function UserCard({ row, onView, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex justify-between">
        <p className="font-semibold">{row.name}</p>
        <span className="text-xs text-gray-500">{row.date}</span>
      </div>

      <Info label="Email" value={row.email} />
      <Info label="Phone" value={row.phone} />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Status</span>
        {row.statusComponent}
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t">
        {onEdit && <button onClick={onEdit}>✏️</button>}
        {onView && <button onClick={onView}>👁</button>}
        {onDelete && <button onClick={onDelete}>🗑</button>}
      </div>
    </div>
  );
}

const Info = ({ label, value }: any) => (
  <div className="flex justify-between text-sm gap-1">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);
