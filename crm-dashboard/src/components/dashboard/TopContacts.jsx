import { Phone, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Avatar, AvatarFallback } from "../ui/avatar.jsx"
import { Button } from "../ui/button.jsx"

const contacts = [
  {
    name: "John Smith",
    company: "Acme Corp",
    role: "CEO",
    deals: 3,
    value: "$67,500",
    initials: "JS",
    color: "bg-chart-1/20 text-chart-1",
  },
  {
    name: "Sarah Chen",
    company: "TechFlow Inc",
    role: "CTO",
    deals: 2,
    value: "$28,000",
    initials: "SC",
    color: "bg-chart-2/20 text-chart-2",
  },
  {
    name: "Mike Davis",
    company: "DataBridge",
    role: "VP Sales",
    deals: 4,
    value: "$42,300",
    initials: "MD",
    color: "bg-chart-3/20 text-chart-3",
  },
  {
    name: "Lisa Wang",
    company: "CloudNine",
    role: "Director",
    deals: 2,
    value: "$38,100",
    initials: "LW",
    color: "bg-chart-4/20 text-chart-4",
  },
  {
    name: "Alex Rivera",
    company: "PixelWorks",
    role: "Founder",
    deals: 1,
    value: "$15,000",
    initials: "AR",
    color: "bg-chart-5/20 text-chart-5",
  },
]

export function TopContacts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.name}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className={contact.color}>
                  {contact.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {contact.role} at {contact.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Mail className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Phone className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
