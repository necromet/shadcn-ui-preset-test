import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"

const revenueData = [
  { month: "Jan", revenue: 18500, target: 20000 },
  { month: "Feb", revenue: 22300, target: 21000 },
  { month: "Mar", revenue: 19800, target: 22000 },
  { month: "Apr", revenue: 27500, target: 23000 },
  { month: "May", revenue: 31200, target: 25000 },
  { month: "Jun", revenue: 28900, target: 27000 },
  { month: "Jul", revenue: 34600, target: 29000 },
  { month: "Aug", revenue: 38200, target: 31000 },
  { month: "Sep", revenue: 33100, target: 33000 },
  { month: "Oct", revenue: 41500, target: 35000 },
  { month: "Nov", revenue: 39800, target: 37000 },
  { month: "Dec", revenue: 45200, target: 39000 },
]

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function RevenueChart() {
  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-chart-1" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-chart-4" />
              Target
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "var(--popover-foreground)",
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--chart-4)"
                strokeDasharray="4 4"
                strokeWidth={2}
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
