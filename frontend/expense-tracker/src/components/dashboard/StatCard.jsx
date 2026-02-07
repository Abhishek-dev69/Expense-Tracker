const StatCard = ({ title, value, highlight = false, icon }) => {
  return (
    <div
      className={`p-6 rounded-xl border ${
        highlight
          ? "bg-emerald-50 border-emerald-300"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">
        ₹{value.toLocaleString()}
      </h3>
    </div>
  )
}

export default StatCard
