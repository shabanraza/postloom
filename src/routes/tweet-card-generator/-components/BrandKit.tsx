import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, Trash2, Type, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTweetStudioStore } from '../-state'
import { BRAND_FONT_CHOICES, isHexColor } from '../-constants'

export function BrandKit() {
    const [newColorName, setNewColorName] = useState('')
    const [newColorValue, setNewColorValue] = useState('#4a6b57')
    const [newFontName, setNewFontName] = useState('')
    const [newFontFamily, setNewFontFamily] = useState<string>(BRAND_FONT_CHOICES[0].fontFamily)
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

    const handleAddFont = () => {
        if (!activeKit || !newFontName.trim()) return
        addBrandFont(activeKit.id, {
            id: String(Date.now()),
            name: newFontName.trim(),
            fontFamily: newFontFamily,
            fontWeight: newFontWeight,
        })
        setNewFontName('')
    }

    if (!activeKit) return null

    return (
        <div className="space-y-6">
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
                                <Label className="text-xs">Add Brand Font</Label>
                                <Input
                                    placeholder="Font name (e.g., Heading)"
                                    value={newFontName}
                                    onChange={(e) => setNewFontName(e.target.value)}
                                    className="h-8 text-sm"
                                />
                                <div className="grid grid-cols-2 gap-1.5">
                                    {BRAND_FONT_CHOICES.map((choice) => (
                                        <button
                                            key={choice.label}
                                            type="button"
                                            aria-pressed={newFontFamily === choice.fontFamily}
                                            className={cn(
                                                "h-8 rounded-md border text-sm transition-colors",
                                                newFontFamily === choice.fontFamily
                                                    ? "border-primary bg-muted"
                                                    : "border-border hover:border-foreground/30"
                                            )}
                                            style={{ fontFamily: choice.fontFamily }}
                                            onClick={() => setNewFontFamily(choice.fontFamily)}
                                        >
                                            {choice.label}
                                        </button>
                                    ))}
                                </div>
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
                                <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={handleAddFont}
                                    disabled={!newFontName.trim()}
                                >
                                    Add Font
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}
