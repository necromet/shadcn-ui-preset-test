import { useState, useEffect } from "react"
import { AlertTriangle, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"
import { Separator } from "../ui/separator.jsx"
import { cn } from "../../lib/utils.js"
import { getAtRiskMembers } from "../../data/mock.js"

const RISK_LEVEL_CONFIG = {
  high: { variant: "destructive", label: "High Risk" },
  medium: { variant: "secondary", label: "Medium Risk" },
  low: { variant: "outline", label: "Low Risk" },
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function RiskScoreMeter({ score, max = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={cn(
            "inline-block size-6 rounded-sm",
            i < score ? "bg-destructive" : "bg-muted"
          )}
        />
      ))}
    </div>
  )
}

export function AtRiskAlerts() {
  const [atRiskMembers, setAtRiskMembers] = useState([])

  useEffect(() => {
    async function fetchAtRiskMembers() {
      const membersData = await getAtRiskMembers()
      setAtRiskMembers(membersData)
    }
    fetchAtRiskMembers()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5" style={{ color: "var(--destructive)" }} />
          <CardTitle className="text-base">At-Risk Members</CardTitle>
          <Badge variant="destructive" className="ml-1">
            {atRiskMembers.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {atRiskMembers.length === 0 ? (
          <p
            className="text-sm text-center py-6"
            style={{ color: "var(--muted-foreground)" }}
          >
            No at-risk members found.
          </p>
        ) : (
          atRiskMembers.map((member) => {
            const riskConfig = RISK_LEVEL_CONFIG[member.riskLevel]
            return (
              <div
                key={member.no_jemaat}
                className="rounded-lg border p-4"
                data-severity={member.riskLevel}
                style={{
                  borderColor:
                    member.riskLevel === "high"
                      ? "var(--destructive)"
                      : "var(--border)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-medium",
                          member.riskLevel === "high"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {getInitials(member.nama_jemaat)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.nama_jemaat}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={riskConfig.variant}>{riskConfig.label}</Badge>
                        <span
                          className="text-xs"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <RiskScoreMeter score={member.riskScore} />
                </div>

                <p
                  className="text-sm mt-3"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {member.riskReason}
                </p>

                <Separator className="my-3" />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Assign Caregiver
                    <ChevronRight className="size-3 ml-1" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" className="text-xs">
                    Schedule Visit
                    <ChevronRight className="size-3 ml-1" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
