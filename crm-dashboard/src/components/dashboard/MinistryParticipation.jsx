import { useState, useMemo } from "react"
import { BarChart3, ArrowUpDown } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { getMinistryParticipation, getTotalServingMembers } from "../../data/mock.js"

const SORT_OPTIONS = [
  { label: "A-Z", value: "alpha" },
  { label: "Count \u2191", value: "asc" },
  { label: "Count \u2193", value: "desc" },
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-sm text-sm"
      style={{ background: "var(--popover)", borderColor: "var(--border)" }}
    >
      <p className="font-medium mb-1">{data.ministry}</p>
      <div className="flex items-center gap-2">
        <span className="inline-block size-2 rounded-full" style={{ background: "var(--chart-1)" }} />
        <span style={{ color: "var(--muted-foreground)" }}>Members:</span>
        <span className="font-medium">{data.count}</span>
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <span style={{ color: "var(--muted-foreground)" }}>Percentage:</span>
        <span className="font-medium">{data.percentage}%</span>
      </div>
    </div>
  )
}

export function MinistryParticipation() {
  const [sortOrder, setSortOrder] = useState("desc")
  const totalServing = getTotalServingMembers()
  const rawData = getMinistryParticipation()

  const sortedData = useMemo(() => {
    const data = [...rawData]
    switch (sortOrder) {
      case "alpha":
        return data.sort((a, b) => a.ministry.localeCompare(b.ministry))
      case "asc":
        return data.sort((a, b) => a.count - b.count)
      case "desc":
      default:
        return data.sort((a, b) => b.count - a.count)
    }
  }, [rawData, sortOrder])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5" style={{ color: "var(--foreground)" }} />
            <CardTitle className="text-base">Ministry Participation</CardTitle>
            <Badge variant="outline" className="ml-2">
              {totalServing} serving members
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpDown className="size-3 mr-1" style={{ color: "var(--muted-foreground)" }} />
            {SORT_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={sortOrder === option.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSortOrder(option.value)}
                className="text-xs h-7"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: 500 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.5}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <YAxis
                type="category"
                dataKey="ministry"
                width={140}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                label={{
                  position: "right",
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                  formatter: (value, entry) => {
                    const pct = entry?.payload?.percentage
                    return pct !== undefined ? `${pct}%` : ""
                  },
                }}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="var(--chart-1)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
