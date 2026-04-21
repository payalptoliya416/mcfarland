export function RecentUserCard({ row, licenseBadge, userBadge }: any) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-4 border-border">
      <p className="font-semibold">{row.name}</p>

      <Info label="Email" value={row.email} />
      <Info label="Phone" value={row.phone} />

      <div className="flex justify-between text-sm gap-1">
        <span className="text-gray-500">Registered</span>
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
          {row.date}
        </span>
      </div>

      <div className="flex justify-between">
        <span className={`px-3 py-1 rounded text-xs ${licenseBadge(row.licenseStatus)}`}>
          {row.licenseStatus}
        </span>

        <span className={`px-3 py-1 rounded text-xs ${userBadge(row.userStatus)}`}>
          {row.userStatus}
        </span>
      </div>
    </div>
  );
}

const Info = ({ label, value }: any) => (
  <div className="flex justify-between text-sm gap-1">
    <span className="text-gray-500">{label}</span>
    <span className="text-right">{value}</span>
  </div>
);
