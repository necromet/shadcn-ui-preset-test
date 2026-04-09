import { useState, useEffect } from "react"
import { Music, Mic, Piano, Drum } from "lucide-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Separator } from "../ui/separator.jsx"
import { cn } from "../../lib/utils.js"
import { getWorshipTeamComposition } from "../../data/mock.js"

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const { name, value } = payload[0]
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{`${value} members`}</p>
    </div>
  )
}

export function WorshipTeamComposition() {
  const [composition, setComposition] = useState({ vocalists: { total: 0, singers: 0, worshipLeaders: 0 }, instrumentalists: { total: 0, pianist: 0, saxophone: 0, bass: 0, drums: 0, filler: 0 } })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await getWorshipTeamComposition()
        setComposition(data)
      } catch (err) {
        console.error("Failed to load worship team composition:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const { vocalists, instrumentalists } = composition

  const pieData = [
    { name: "Vocalists", value: vocalists.total },
    { name: "Instrumentalists", value: instrumentalists.total },
  ]

  const total = vocalists.total + instrumentalists.total

  const COLORS = ["var(--chart-1)", "var(--chart-2)"]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Music className="size-5 text-muted-foreground" />
          <CardTitle>Worship Team Composition</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground"
              >
                <tspan x="50%" dy="-0.2em" className="text-2xl font-bold" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  {total}
                </tspan>
                <tspan x="50%" dy="1.4em" style={{ fontSize: "0.75rem", fill: "var(--muted-foreground)" }}>
                  Total
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mic className="size-4 text-[var(--chart-1)]" />
              <span className="text-sm font-medium">Vocalists</span>
              <Badge variant="outline" className="ml-auto">{vocalists.total}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs">
                Singers: {vocalists.singers}
              </Badge>
              <Badge variant="outline" className="text-xs">
                WL: {vocalists.worshipLeaders}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Piano className="size-4 text-[var(--chart-2)]" />
              <span className="text-sm font-medium">Instrumentalists</span>
              <Badge variant="outline" className="ml-auto">{instrumentalists.total}</Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs">
                Piano: {instrumentalists.pianist}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Sax: {instrumentalists.saxophone}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Bass: {instrumentalists.bass}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Drums: {instrumentalists.drums}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Filler: {instrumentalists.filler}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
