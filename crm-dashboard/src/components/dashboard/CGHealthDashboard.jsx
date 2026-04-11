import { useState, useEffect } from "react"
import { Users, TrendingUp, AlertCircle, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Progress } from "../ui/progress.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"
import { Separator } from "../ui/separator.jsx"
import { cn } from "../../lib/utils.js"
import { getCGHealthData } from "../../data/mock.js"

function getVitalityScore(cg) {
  const capacityScore = (cg.memberCount / cg.capacity) * 100
  const attendanceScore = cg.attendanceRate
  const riskPenalty = cg.atRiskMembers > 0 ? Math.min(cg.atRiskMembers * 10, 30) : 0
  const growthBonus = cg.newMembersThisQuarter > 0 ? Math.min(cg.newMembersThisQuarter * 5, 15) : 0

  return Math.min(
    Math.round((capacityScore * 0.3) + (attendanceScore * 0.6) + growthBonus - riskPenalty),
    100
  )
}

function getVitalityColor(score) {
  if (score >= 80) return "var(--chart-1)"
  if (score >= 50) return "var(--chart-3)"
  return "var(--destructive)"
}

function getAttendanceVariant(rate) {
  if (rate > 80) return "success"
  if (rate >= 50) return "warning"
  return "destructive"
}

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function CGHealthDashboard() {
  const [cgData, setCgData] = useState([])

  useEffect(() => {
    async function fetchCGData() {
      const data = await getCGHealthData()
      setCgData(data)
    }
    fetchCGData()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cgData.map((cg) => {
        const vitalityScore = getVitalityScore(cg)
        const vitalityColor = getVitalityColor(vitalityScore)
        const capacityPercent = Math.round((cg.memberCount / cg.capacity) * 100)

        return (
          <Card key={cg.cg_id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{cg.nama_cgf}</CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Crown className="size-3.5" />
                {cg.leader_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="relative flex size-20 items-center justify-center rounded-full border-4 border-background shrink-0"
                  style={{
                    background: `conic-gradient(${vitalityColor} ${vitalityScore}%, var(--muted) ${vitalityScore}%)`,
                  }}
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-background">
                    <span className="text-lg font-bold">{vitalityScore}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">Vitality Score</span>
                  <Badge
                    variant={
                      vitalityScore >= 80
                        ? "success"
                        : vitalityScore >= 50
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {vitalityScore >= 80
                      ? "Healthy"
                      : vitalityScore >= 50
                        ? "Moderate"
                        : "At Risk"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium">
                    {cg.memberCount}/{cg.capacity}
                  </span>
                </div>
                <Progress value={capacityPercent} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attendance</span>
                <Badge variant={getAttendanceVariant(cg.attendanceRate)}>
                  {cg.attendanceRate}%
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">New this quarter</span>
                <Badge variant="outline" className="gap-1">
                  <Users className="size-3" />
                  {cg.newMembersThisQuarter}
                </Badge>
              </div>

              {cg.atRiskMembers > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">At risk</span>
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="size-3" />
                    {cg.atRiskMembers}
                  </Badge>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <button className="w-full text-sm font-medium text-primary hover:underline">
                View Details
              </button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
