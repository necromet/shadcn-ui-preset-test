import { useState, useEffect } from "react"
import { Gauge, TrendingUp, Users, Award } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Progress } from "../ui/progress.jsx"
import { Separator } from "../ui/separator.jsx"
import { cn } from "../../lib/utils.js"
import { getAverageEngagementScore, getMemberEngagementScore, getMembers } from "../../data/mock.js"

const SCORE_BREAKDOWN = [
  { label: "Service", weight: "40%" },
  { label: "Events", weight: "30%" },
  { label: "Status", weight: "20%" },
  { label: "Versatility", weight: "10%" },
]

const SCORE_RANGES = [
  { range: "0-20", min: 0, max: 20 },
  { range: "21-40", min: 21, max: 40 },
  { range: "41-60", min: 41, max: 60 },
  { range: "61-80", min: 61, max: 80 },
  { range: "81-100", min: 81, max: 100 },
]

function getScoreColor(score) {
  if (score >= 70) return "var(--chart-1)"
  if (score >= 40) return "var(--chart-3)"
  return "var(--destructive)"
}

function getScoreVariant(score) {
  if (score >= 70) return "success"
  if (score >= 40) return "warning"
  return "destructive"
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{payload[0].value} members</p>
    </div>
  )
}

export function MemberEngagementScore() {
  const [avgScore, setAvgScore] = useState(0)
  const [scoreDistribution, setScoreDistribution] = useState([])
  const [totalMembers, setTotalMembers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [avg, membersData] = await Promise.all([
          getAverageEngagementScore(),
          getMembers()
        ])
        setAvgScore(avg)

        // Calculate score distribution
        const distribution = await Promise.all(
          SCORE_RANGES.map(async (range) => {
            const count = (await Promise.all(
              membersData.map(async (m) => {
                const score = await getMemberEngagementScore(m.no_jemaat)
                return score >= range.min && score <= range.max ? 1 : 0
              })
            )).reduce((sum, val) => sum + val, 0)
            return { range: range.range, count }
          })
        )
        setScoreDistribution(distribution)
        setTotalMembers(membersData.length)
      } catch (err) {
        console.error("Failed to load engagement scores:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const scoreColor = getScoreColor(avgScore)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Member Engagement</CardTitle>
        </div>
        <Badge variant={getScoreVariant(avgScore)}>
          <Award className="size-3 mr-1" />
          {avgScore}/100
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Gauge + Breakdown */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative size-32 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${scoreColor} ${avgScore * 3.6}deg, var(--muted) ${avgScore * 3.6}deg)`,
              }}
            >
              <div className="size-24 rounded-full bg-background flex items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: scoreColor }}>
                  {avgScore}
                </span>
              </div>
            </div>

            <Separator />

            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Score Breakdown
              </p>
              {SCORE_BREAKDOWN.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Distribution Chart */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Score Distribution
            </p>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="size-3" />
              <span>{totalMembers} total members</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
