import { BarChart3, TrendingUp } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { cn } from "../../lib/utils.js"
import { getServiceFrequencyDistribution } from "../../data/mock.js"

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const data = payload[0].payload
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{`Range: ${label}`}</p>
      <p className="text-sm text-muted-foreground">{`Members: ${data.count}`}</p>
      {data.avgServices !== undefined && (
        <p className="text-sm text-muted-foreground">{`Avg Services: ${data.avgServices}`}</p>
      )}
    </div>
  )
}

export function ServiceFrequency() {
  const data = getServiceFrequencyDistribution()

  const totalMembers = data.reduce((sum, d) => sum + d.count, 0)
  const totalServices = data.reduce((sum, d) => {
    if (d.range === "0") return sum
    if (d.range === "51+") return sum + d.count * 55
    const mid = d.range.split("-").map(Number)
    const avg = (mid[0] + mid[1]) / 2
    return sum + d.count * avg
  }, 0)
  const avgServicesPerMember = totalMembers > 0 ? Math.round(totalServices / totalMembers) : 0

  const chartData = data.map((d) => {
    let avgServices = 0
    if (d.range === "0") avgServices = 0
    else if (d.range === "51+") avgServices = 55
    else {
      const mid = d.range.split("-").map(Number)
      avgServices = (mid[0] + mid[1]) / 2
    }
    return { ...d, avgServices }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-muted-foreground" />
            <CardTitle>Service Frequency Distribution</CardTitle>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="size-3" />
            Avg: {avgServicesPerMember} services/member
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
