const StatsGrid = ({ total, completed, pending }: { total: number, completed: number, pending: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Tasks" value={total} />
            <StatCard label="Completed" value={completed} />
            <StatCard label="Pending" value={pending} />
            <StatCard
                label="Completion Rate"
                value={`${Math.round((completed / total) * 100 || 0)}%`}
            />
        </div>
    )
}

function StatCard({
    label,
    value,
}: {
    label: string
    value: number | string
}) {
    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
    )
}


export default StatsGrid