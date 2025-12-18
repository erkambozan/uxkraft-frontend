/**
 * Reusable Tailwind class constants for consistent styling
 */

// Base form input styles
export const inputBase = [
  "flex h-10 w-full rounded-md border border-input bg-background",
  "px-3 py-2 text-sm",
]

export const inputFocus = [
  "ring-offset-background",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
]

export const inputDisabled = "disabled:cursor-not-allowed disabled:opacity-50"

export const inputFile = [
  "file:border-0 file:bg-transparent",
  "file:text-sm file:font-medium",
]

export const inputPlaceholder = "placeholder:text-muted-foreground"

// Button base styles
export const buttonBase = [
  "inline-flex items-center justify-center whitespace-nowrap",
  "rounded-md text-sm font-medium",
  "ring-offset-background transition-colors",
]

export const buttonFocus = [
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
]

export const buttonDisabled = "disabled:pointer-events-none disabled:opacity-50"

// Select styles
export const selectTriggerBase = [
  "flex h-10 w-full items-center justify-between",
  "rounded-md border border-input bg-background",
  "px-3 py-2 text-sm",
]

export const selectFocus = [
  "focus:outline-none focus:ring-2",
  "focus:ring-ring focus:ring-offset-2",
]

export const selectDisabled = "disabled:cursor-not-allowed disabled:opacity-50"

// Animation styles
export const animateIn = "data-[state=open]:animate-in"
export const animateOut = "data-[state=closed]:animate-out"
export const fadeIn = "data-[state=open]:fade-in-0"
export const fadeOut = "data-[state=closed]:fade-out-0"

// Checkbox styles
export const checkboxBase = [
  "peer h-4 w-4 shrink-0 rounded-sm",
  "border border-primary ring-offset-background",
]

export const checkboxFocus = [
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
]

export const checkboxChecked = [
  "data-[state=checked]:bg-primary",
  "data-[state=checked]:text-primary-foreground",
]


