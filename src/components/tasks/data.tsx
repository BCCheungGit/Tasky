import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Check,
    X,
  CheckCircle,
  Circle,
} from "lucide-react"



export const priorities = [
    {
        label: "Low",
        value: "low",
        icon: ArrowDown,
    },
    {
        label: "Medium",
        value: "medium",
        icon: ArrowRight,
    },
    {
        label: "High",
        value: "high",
        icon: ArrowUp,
    },
]

export const status = [
    {
        label: "Complete",
        value: "Complete",
        icon: CheckCircle,
    },
    {
        label: "Incomplete",
        value: "Incomplete",
        icon: Circle,
    },
]