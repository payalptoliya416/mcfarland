export function RecentWonUserCard({ row }: any) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-4 border-border">
      <p className="font-semibold">{row.machinery}</p>

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">User</span>
        <span>{row.user}</span>
      </div>

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">Price</span>
        <span className="font-medium">{row.price}</span>
      </div>
    </div>
  );
}
