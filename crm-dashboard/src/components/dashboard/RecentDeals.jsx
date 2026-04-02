import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table.jsx"
import { Badge } from "../ui/badge.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"

const deals = [
  {
    id: 1,
    name: "Enterprise Plan",
    company: "Acme Corp",
    value: "$45,000",
    status: "won",
    contact: "John Smith",
    initials: "JS",
  },
  {
    id: 2,
    name: "Pro Subscription",
    company: "TechFlow Inc",
    value: "$12,500",
    status: "negotiation",
    contact: "Sarah Chen",
    initials: "SC",
  },
  {
    id: 3,
    name: "Team License",
    company: "DataBridge",
    value: "$8,200",
    status: "proposal",
    contact: "Mike Davis",
    initials: "MD",
  },
  {
    id: 4,
    name: "Custom Integration",
    company: "CloudNine",
    value: "$32,000",
    status: "won",
    contact: "Lisa Wang",
    initials: "LW",
  },
  {
    id: 5,
    name: "Annual Plan",
    company: "GreenLeaf",
    value: "$6,800",
    status: "lost",
    contact: "Tom Brown",
    initials: "TB",
  },
]

const statusConfig = {
  won: { label: "Won", variant: "success" },
  negotiation: { label: "Negotiation", variant: "warning" },
  proposal: { label: "Proposal", variant: "secondary" },
  lost: { label: "Lost", variant: "destructive" },
}

export function RecentDeals() {
  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle>Recent Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">{deal.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {deal.company}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-muted">
                        {deal.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{deal.contact}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[deal.status].variant}>
                    {statusConfig[deal.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {deal.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
