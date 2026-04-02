import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Progress } from "../ui/progress.jsx"

const pipelineStages = [
  { stage: "Lead", count: 156, value: "$234,000", progress: 85 },
  { stage: "Qualified", count: 89, value: "$187,500", progress: 65 },
  { stage: "Proposal", count: 42, value: "$128,300", progress: 45 },
  { stage: "Negotiation", count: 18, value: "$76,200", progress: 28 },
  { stage: "Closed Won", count: 12, value: "$54,800", progress: 18 },
]

export function DealPipeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {pipelineStages.map((item) => (
          <div key={item.stage} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.stage}</span>
              <span className="text-muted-foreground">
                {item.count} deals &middot; {item.value}
              </span>
            </div>
            <Progress value={item.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
