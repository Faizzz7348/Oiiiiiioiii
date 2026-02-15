import { useDialogFullscreen } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type DialogTableWrapperProps = {
  children: React.ReactNode
  className?: string
}

export function DialogTableWrapper({ children, className }: DialogTableWrapperProps) {
  const isFullscreen = useDialogFullscreen()
  
  return (
    <div 
      className={cn(
        "overflow-auto -mx-6 px-6 flex-shrink",
        isFullscreen ? "max-h-[calc(100vh-200px)]" : "max-h-[350px]",
        className
      )}
    >
      {children}
    </div>
  )
}
