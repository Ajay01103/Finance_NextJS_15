import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h3 className="font-medium text-muted-foreground">Loading...</h3>
      </div>
    </div>
  )
}
