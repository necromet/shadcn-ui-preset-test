import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent } from "../ui/card.jsx"
import { cn } from "../../lib/utils.js"

const stats = [
  {
    title: "Total Revenue",
    value: "$124,563",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Contacts",
    value: "2,847",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Deals Won",
    value: "149",
    change: "+23.1%",
    trend: "up",
    icon: Target,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-2.4%",
    trend: "down",
    icon: TrendingUp,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-chart-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.trend === "up" ? "text-chart-1" : "text-destructive"
                  )}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
