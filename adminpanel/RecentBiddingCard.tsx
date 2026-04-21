export function RecentBiddingCard({ row }: any) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-4 border-border">
      <p className="font-semibold">{row.name}</p>

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">Total Bid</span>
        <span className="font-medium">{row.totalBid}</span>
      </div>

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">Bid End</span>
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
          {row.date}
        </span>
      </div>
    </div>
  );
}
