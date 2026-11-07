import { useTweetStudioStore } from '../-state'
import { logoPlacement } from '../-utils'

/** The active brand kit's logo, drawn on the canvas so it is part of every export. */
export function BrandLogoOverlay({ canvasWidth, canvasHeight }: { canvasWidth: number; canvasHeight: number }) {
    const logoOverlay = useTweetStudioStore((s) => s.logoOverlay)
    const logoUrl = useTweetStudioStore((s) => {
        const kit = s.brandKits.find((k) => k.id === s.activeBrandKitId) ?? s.brandKits[0]
        return kit?.logoUrl
    })

    const box = logoUrl ? logoPlacement(canvasWidth, canvasHeight, logoOverlay) : null
    if (!logoUrl || !box) return null

    const { size, ...edges } = box
    return (
        <img
            src={logoUrl}
            alt="Brand logo"
            draggable={false}
            className="pointer-events-none absolute z-20 object-contain"
            style={{ width: size, height: size, ...edges }}
        />
    )
}
