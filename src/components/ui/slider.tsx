import * as React from "react"

interface SliderProps {
  value: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  className?: string
  disabled?: boolean
  "aria-label"?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, min = 0, max = 100, step = 1, onValueChange, onValueCommit, className = "", disabled = false, ...props }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      if (onValueChange) {
        onValueChange([newValue])
      }
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
      const newValue = parseFloat((e.target as HTMLInputElement).value)
      if (onValueCommit) {
        onValueCommit([newValue])
      }
    }

    const handleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
      const newValue = parseFloat((e.target as HTMLInputElement).value)
      if (onValueCommit) {
        onValueCommit([newValue])
      }
    }

    return (
      <div ref={ref} className={`relative flex items-center w-full ${className}`}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          disabled={disabled}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`,
          }}
          {...props}
        />
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
