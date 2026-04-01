import { cn } from "@workspace/ui/lib/utils"

interface BlockImageProps {
  name: string
  width?: number
  height?: number
  className?: string
}

export function BlockImage({
  name,
  width = 1440,
  height = 900,
  className,
}: BlockImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-[1440/900] w-full overflow-hidden rounded-lg",
        className
      )}
    >
      <img
        src={`/r/styles/new-york/${name}-light.png`}
        alt={name}
        width={width}
        height={height}
        className="object-cover dark:hidden"
        data-image="light"
      />
      <img
        src={`/r/styles/new-york/${name}-dark.png`}
        alt={name}
        width={width}
        height={height}
        className="hidden object-cover dark:block"
        data-image="dark"
      />
    </div>
  )
}
