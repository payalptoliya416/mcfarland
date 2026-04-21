export function RecentOrderCard({ row }: any) {
  return (
    <div className="border border-border rounded-xl p-4 bg-white space-y-2">
      <p className="font-semibold text-sm text-gray-800">
        {row.orderId}
      </p>
      <p className="text-sm text-gray-600">Type: {row.type}</p>
      <p className="text-sm text-gray-600">
        User: <span className="font-medium">{row.userName}</span>
      </p>

      <p className="text-sm text-gray-600">
        Phone: {row.phone}
      </p>

      <p className="text-sm text-gray-600">
        Amount: <span className="font-semibold">{row.amount}</span>
      </p>

      <p className="text-sm text-gray-500">
        Date: {row.date}
      </p>

      <span
        className={`px-3 py-1 rounded-md text-xs font-medium inline-block ${row.badge}`}
      >
        {row.status}
      </span>
    </div>
  );
}
