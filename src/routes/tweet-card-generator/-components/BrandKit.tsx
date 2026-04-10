import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, Trash2, Type, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTweetStudioStore } from '../-state'

export function BrandKit() {
    const [newColorName, setNewColorName] = useState('')
    const [newColorValue, setNewColorValue] = useState('#3b82f6')
    const [newFontName, setNewFontName] = useState('')
    
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
        if (!activeKit || !newColorName.trim()) return
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
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 400,
        })
        setNewFontName('')
    }

    if (!activeKit) return null

    return (
        <div className="space-y-6">
            {/* Brand Colors */}
            <div className="space-y-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Brand Colors</p>
                <div className="flex flex-wrap gap-2">
                    {activeKit.colors.map((color) => (
                        <Popover key={color.id}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "relative group h-9 w-9 rounded-lg border-2 transition-all hover:scale-105 shadow-sm",
                                        design.backgroundColor === color.color
                                            ? "border-slate-900 dark:border-white ring-2 ring-slate-900/10 dark:ring-white/20"
                                            : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                                    )}
                                    style={{ backgroundColor: color.color }}
                                    title={color.name}
                                    onClick={() => applyBrandColor(color.color)}
                                >
                                    {design.backgroundColor === color.color && (
                                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" />
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium">{color.name}</span>
                                    <span className="text-xs text-muted-foreground">{color.color}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 ml-auto"
                                        onClick={() => removeBrandColor(activeKit.id, color.id)}
                                    >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ))}

                    {/* Add Color */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="h-9 w-9 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                                <Plus className="h-4 w-4 text-slate-400" />
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
                                        value={newColorValue}
                                        onChange={(e) => setNewColorValue(e.target.value)}
                                        className="h-8 w-12 p-1 cursor-pointer"
                                    />
                                    <Input
                                        value={newColorValue}
                                        onChange={(e) => setNewColorValue(e.target.value)}
                                        className="h-8 text-sm flex-1"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={handleAddColor}
                                    disabled={!newColorName.trim()}
                                >
                                    Add Color
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

            {/* Brand Fonts */}
            <div className="space-y-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Brand Fonts</p>
                <div className="space-y-2">
                    {activeKit.fonts.map((font) => (
                        <div
                            key={font.id}
                            className={cn(
                                "group flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all",
                                design.fontFamily === font.fontFamily && design.fontWeight === font.fontWeight
                                    ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                            onClick={() => applyBrandFont(font.fontFamily, font.fontWeight)}
                        >
                            <div className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-slate-400" />
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
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
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
                            <button className="w-full p-2.5 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center gap-2 hover:border-slate-400 dark:hover:border-slate-500 transition-colors text-sm text-slate-400">
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
