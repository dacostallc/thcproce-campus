import { cva, type VariantProps } from "class-variance-authority";

/**
 * Variantes do botão sem `"use client"` — podem ser importadas em Server Components
 * (ex.: `src/app/page.tsx`). O `button.tsx` cliente re-exporta isto para compatibilidade.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canna-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-canna-500 text-ink-900 hover:bg-canna-400 shadow-lg shadow-canna-500/25",
        glass: "glass-strong hover:bg-white/10 text-white",
        destructive: "bg-rose-600 text-white hover:bg-rose-500",
        link: "text-canna-300 underline-offset-4 hover:underline"
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
        icon: "size-10 p-0"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
