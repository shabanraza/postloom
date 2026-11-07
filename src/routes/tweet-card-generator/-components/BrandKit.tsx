import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, Trash2, Type, Check, X, Pencil, Upload, EyeOff } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useTweetStudioStore } from '../-state'
import { BRAND_FONT_CHOICES, brandFontName, isHexColor } from '../-constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fitWithin } from '../-utils'
import type { LogoPosition } from '../-types'

const MAX_LOGO_BYTES = 5 * 1024 * 1024

/** Read an uploaded logo as a small data URL (max 512px) so it can be saved in the browser. */
async function readLogoFile(file: File): Promise<string> {
    const asDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
    })
    if (file.type === 'image/svg+xml') return asDataUrl
    const img = new Image()
    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Could not read that image'))
        img.src = asDataUrl
    })
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, 512)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL('image/png')
}

const LOGO_SPOTS: { position: Exclude<LogoPosition, 'none'>; label: string; className: string }[] = [
    { position: 'top-left', label: 'Logo top left', className: 'items-start justify-start' },
    { position: 'top-right', label: 'Logo top right', className: 'items-start justify-end' },
    { position: 'bottom-left', label: 'Logo bottom left', className: 'items-end justify-start' },
    { position: 'bottom-right', label: 'Logo bottom right', className: 'items-end justify-end' },
]

export function BrandKit() {
    const [newColorName, setNewColorName] = useState('')
    const [newColorValue, setNewColorValue] = useState('#4a6b57')
    const [newFontFamily, setNewFontFamily] = useState<string>('Georgia, serif')
    const [newFontWeight, setNewFontWeight] = useState(400)
    const colorIsValid = isHexColor(newColorValue)
    
    const brandKits = useTweetStudioStore((state) => state.brandKits)
    const activeBrandKitId = useTweetStudioStore((state) => state.activeBrandKitId)
    const addBrandColor = useTweetStudioStore((state) => state.addBrandColor)
    const removeBrandColor = useTweetStudioStore((state) => state.removeBrandColor)
    const addBrandFont = useTweetStudioStore((state) => state.addBrandFont)
    const removeBrandFont = useTweetStudioStore((state) => state.removeBrandFont)
    const applyBrandColor = useTweetStudioStore((state) => state.applyBrandColor)
    const applyBrandFont = useTweetStudioStore((state) => state.applyBrandFont)
    const design = useTweetStudioStore((state) => state.design)
    const createBrandKit = useTweetStudioStore((state) => state.createBrandKit)
    const renameBrandKit = useTweetStudioStore((state) => state.renameBrandKit)
    const deleteBrandKit = useTweetStudioStore((state) => state.deleteBrandKit)
    const setActiveBrandKit = useTweetStudioStore((state) => state.setActiveBrandKit)
    const setBrandLogo = useTweetStudioStore((state) => state.setBrandLogo)
    const logoOverlay = useTweetStudioStore((state) => state.logoOverlay)
    const setLogoOverlay = useTweetStudioStore((state) => state.setLogoOverlay)
    const [renaming, setRenaming] = useState(false)
    const [kitName, setKitName] = useState('')
    const fileRef = useRef<HTMLInputElement>(null)

    // Use first brand kit if none active
    const activeKit = brandKits.find((k) => k.id === activeBrandKitId) || brandKits[0]

    const handleAddColor = () => {
        if (!activeKit || !newColorName.trim() || !colorIsValid) return
        addBrandColor(activeKit.id, {
            id: String(Date.now()),
            name: newColorName.trim(),
            color: newColorValue,
        })
        setNewColorName('')
    }

    const pickedFont = BRAND_FONT_CHOICES.find((f) => f.fontFamily === newFontFamily) ?? BRAND_FONT_CHOICES[0]
    const fontAlreadyInKit = !!activeKit?.fonts.some(
        (f) => f.fontFamily === newFontFamily && f.fontWeight === newFontWeight
    )

    const handleAddFont = () => {
        if (!activeKit || fontAlreadyInKit) return
        addBrandFont(activeKit.id, {
            id: String(Date.now()),
            name: brandFontName(pickedFont.label, newFontWeight),
            fontFamily: newFontFamily,
            fontWeight: newFontWeight,
        })
    }

    if (!activeKit) return null

    const handleLogoFile = async (file: File | undefined) => {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('That file is not an image', { description: 'Use a PNG, SVG, JPG or WebP logo.' })
            return
        }
        if (file.size > MAX_LOGO_BYTES) {
            toast.error('That logo is too big', { description: 'Use an image under 5 MB.' })
            return
        }
        try {
            setBrandLogo(activeKit.id, await readLogoFile(file))
            if (logoOverlay.position === 'none') setLogoOverlay({ position: 'bottom-right' })
        } catch {
            toast.error('Could not read that image', { description: 'Try a PNG or JPG instead.' })
        }
    }

    const handleDeleteKit = () => {
        const removed = activeKit
        const index = brandKits.findIndex((k) => k.id === removed.id)
        deleteBrandKit(removed.id)
        setActiveBrandKit(null)
        toast(`Deleted "${removed.name}"`, {
            duration: 10000,
            action: {
                label: 'Undo',
                onClick: () =>
                    useTweetStudioStore.setState((st) => {
                        const kits = [...st.brandKits]
                        kits.splice(index, 0, removed)
                        return { brandKits: kits, activeBrandKitId: removed.id }
                    }),
            },
        })
    }

    const commitRename = () => {
        renameBrandKit(activeKit.id, kitName)
        setRenaming(false)
    }

    return (
        <div className="space-y-6">
            {/* Which brand kit */}
            <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Brand kit</p>
                {renaming ? (
                    <Input
                        autoFocus
                        aria-label="Brand kit name"
                        value={kitName}
                        maxLength={40}
                        onChange={(e) => setKitName(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') commitRename()
                            if (e.key === 'Escape') {
                                e.preventDefault()
                                setRenaming(false)
                            }
                        }}
                        className="h-8 text-sm"
                    />
                ) : (
                    <div className="flex gap-1.5">
                        <select
                            aria-label="Choose brand kit"
                            value={activeKit.id}
                            onChange={(e) => setActiveBrandKit(e.target.value)}
                            className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {brandKits.map((kit) => (
                                <option key={kit.id} value={kit.id}>
                                    {kit.name}
                                </option>
                            ))}
                        </select>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            aria-label="Rename brand kit"
                            title="Rename"
                            onClick={() => {
                                setKitName(activeKit.name)
                                setRenaming(true)
                            }}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            aria-label="New brand kit"
                            title="New brand kit"
                            onClick={() => createBrandKit(`Brand ${brandKits.length + 1}`)}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            aria-label="Delete brand kit"
                            title={brandKits.length <= 1 ? 'You need at least one brand kit' : 'Delete this brand kit'}
                            disabled={brandKits.length <= 1}
                            onClick={handleDeleteKit}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Logo */}
            <div className="space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Logo</p>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                    onChange={(e) => {
                        void handleLogoFile(e.target.files?.[0])
                        e.target.value = ''
                    }}
                />
                {activeKit.logoUrl ? (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:12px_12px] p-1.5">
                                <img src={activeKit.logoUrl} alt="" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => fileRef.current?.click()}>
                                    Replace
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                                    onClick={() => setBrandLogo(activeKit.id, undefined)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground">Place on the card</p>
                            <div className="flex gap-1.5">
                                {LOGO_SPOTS.map((spot) => (
                                    <button
                                        key={spot.position}
                                        type="button"
                                        aria-label={spot.label}
                                        aria-pressed={logoOverlay.position === spot.position}
                                        title={spot.label}
                                        onClick={() => setLogoOverlay({ position: spot.position })}
                                        className={cn(
                                            'flex h-9 flex-1 rounded-md border p-1.5 transition-colors',
                                            spot.className,
                                            logoOverlay.position === spot.position
                                                ? 'border-primary bg-muted'
                                                : 'border-border hover:border-foreground/30'
                                        )}
                                    >
                                        <span className="h-2 w-2 rounded-sm bg-foreground/70" />
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    aria-label="Hide logo"
                                    aria-pressed={logoOverlay.position === 'none'}
                                    title="Hide logo"
                                    onClick={() => setLogoOverlay({ position: 'none' })}
                                    className={cn(
                                        'flex h-9 flex-1 items-center justify-center rounded-md border transition-colors',
                                        logoOverlay.position === 'none'
                                            ? 'border-primary bg-muted'
                                            : 'border-border hover:border-foreground/30'
                                    )}
                                >
                                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {logoOverlay.position !== 'none' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Size</span>
                                    <span className="font-mono">{logoOverlay.size}%</span>
                                </div>
                                <Slider
                                    aria-label="Logo size"
                                    min={5}
                                    max={30}
                                    step={1}
                                    value={[logoOverlay.size]}
                                    onValueChange={([v]) => setLogoOverlay({ size: v })}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault()
                            void handleLogoFile(e.dataTransfer.files?.[0])
                        }}
                        className="flex w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border px-3 py-4 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                        <Upload className="h-4 w-4" />
                        <span className="font-medium">Upload logo</span>
                        <span className="text-[11px]">PNG, SVG or JPG. A transparent PNG looks best.</span>
                    </button>
                )}
            </div>

            <div className="h-px bg-border" />

            {/* Brand Colors */}
            <div className="space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Brand Colors</p>
                <div className="flex flex-wrap gap-2">
                    {activeKit.colors.map((color) => {
                        const isActive = design.backgroundType === 'solid' && design.backgroundColor === color.color
                        return (
                            <div key={color.id} className="group relative">
                                <button
                                    type="button"
                                    aria-label={`Apply ${color.name}`}
                                    aria-pressed={isActive}
                                    title={`${color.name} ${color.color}`}
                                    className={cn(
                                        "relative h-9 w-9 rounded-lg border transition-all hover:scale-105 shadow-sm",
                                        isActive
                                            ? "border-primary ring-2 ring-primary/30"
                                            : "border-foreground/15 hover:border-foreground/30"
                                    )}
                                    style={{ backgroundColor: color.color }}
                                    onClick={() => applyBrandColor(color.color)}
                                >
                                    {isActive && (
                                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Remove ${color.name}`}
                                    title={`Remove ${color.name}`}
                                    className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                                    onClick={() => removeBrandColor(activeKit.id, color.id)}
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </div>
                        )
                    })}

                    {/* Add Color */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button type="button" aria-label="Add brand colour" className="h-9 w-9 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-foreground/20 transition-colors">
                                <Plus className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                            <div className="space-y-3">
                                <Label className="text-xs">Add Brand Color</Label>
                                <Input
                                    placeholder="Color name"
                                    value={newColorName}
                                    onChange={(e) => setNewColorName(e.target.value)}
                                    className="h-8 text-sm"
                                />
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        aria-label="Pick colour"
                                        value={colorIsValid ? newColorValue : '#000000'}
                                        onChange={(e) => setNewColorValue(e.target.value)}
                                        className="h-8 w-12 p-1 cursor-pointer"
                                    />
                                    <Input
                                        aria-label="Hex code"
                                        aria-invalid={!colorIsValid}
                                        value={newColorValue}
                                        onChange={(e) => setNewColorValue(e.target.value.trim())}
                                        className="h-8 text-sm flex-1 font-mono aria-[invalid=true]:border-destructive"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={handleAddColor}
                                    disabled={!newColorName.trim() || !colorIsValid}
                                >
                                    Add Color
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="h-px bg-border" />

            {/* Brand Fonts */}
            <div className="space-y-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Brand Fonts</p>
                <div className="space-y-2">
                    {activeKit.fonts.map((font) => (
                        <div
                            key={font.id}
                            className={cn(
                                "group flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all",
                                design.fontFamily === font.fontFamily && design.fontWeight === font.fontWeight
                                    ? "border-primary bg-muted/50"
                                    : "border-border hover:border-foreground/20"
                            )}
                            onClick={() => applyBrandFont(font.fontFamily, font.fontWeight)}
                        >
                            <div className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-muted-foreground" />
                                <span
                                    className="text-sm"
                                    style={{ fontFamily: font.fontFamily, fontWeight: font.fontWeight }}
                                >
                                    {font.name}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Remove ${font.name}`}
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeBrandFont(activeKit.id, font.id)
                                }}
                            >
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                    ))}

                    {/* Add Font */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="w-full p-2.5 rounded-lg border-2 border-dashed border-border flex items-center justify-center gap-2 hover:border-foreground/20 transition-colors text-sm text-muted-foreground">
                                <Plus className="h-4 w-4" />
                                Add Font
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                            <div className="space-y-3">
                                <Label className="text-xs">Add a brand font</Label>
                                <Select value={newFontFamily} onValueChange={setNewFontFamily}>
                                    <SelectTrigger aria-label="Font" className="h-9 w-full text-sm" style={{ fontFamily: newFontFamily }}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BRAND_FONT_CHOICES.map((choice) => (
                                            <SelectItem key={choice.label} value={choice.fontFamily} style={{ fontFamily: choice.fontFamily }}>
                                                {choice.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[{ label: 'Regular', weight: 400 }, { label: 'Bold', weight: 700 }].map((w) => (
                                        <button
                                            key={w.weight}
                                            type="button"
                                            aria-pressed={newFontWeight === w.weight}
                                            className={cn(
                                                "h-8 rounded-md border text-sm transition-colors",
                                                newFontWeight === w.weight
                                                    ? "border-primary bg-muted"
                                                    : "border-border hover:border-foreground/30"
                                            )}
                                            style={{ fontWeight: w.weight }}
                                            onClick={() => setNewFontWeight(w.weight)}
                                        >
                                            {w.label}
                                        </button>
                                    ))}
                                </div>
                                <p
                                    className="rounded-md bg-muted/60 px-2.5 py-2 text-base leading-snug text-foreground"
                                    style={{ fontFamily: newFontFamily, fontWeight: newFontWeight }}
                                >
                                    Ship it today
                                </p>
                                <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={handleAddFont}
                                    disabled={fontAlreadyInKit}
                                >
                                    {fontAlreadyInKit ? 'Already in your kit' : 'Add to kit'}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}
