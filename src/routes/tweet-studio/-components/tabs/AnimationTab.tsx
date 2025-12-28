import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { ANIMATION_SPEED_RANGE } from '../../-constants'
import type { AnimationType } from '../../-types'

export function AnimationTab() {
    const {
        animation,
        tweet,
        setAnimationType,
        setAnimationSpeed,
        setAnimationDelay,
        setAnimationLoop,
        setShowCursor,
    } = useTweetStudioStore()

    const estimatedDuration = tweet.content.text.length / animation.speed
    const estimatedFrames = Math.ceil(estimatedDuration * animation.fps)

    return (
        <div className="space-y-4">
            {/* Animation Preview */}
            <div className="rounded-md border p-2.5 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">🎬 Animation Preview</p>
                <div className="h-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Preview area</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                        <Play className="h-3.5 w-3.5" />
                        Play
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restart
                    </Button>
                </div>
            </div>

            {/* Animation Type */}
            <div className="space-y-2 rounded-md border p-2.5">
                <p className="text-xs font-medium text-muted-foreground">Animation Type</p>
                <RadioGroup
                    value={animation.type}
                    onValueChange={(value) => setAnimationType(value as AnimationType)}
                    className="gap-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="anim-none" />
                        <Label htmlFor="anim-none" className="text-sm font-normal cursor-pointer">
                            None (PNG export)
                        </Label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="typewriter" id="anim-typewriter" />
                            <Label htmlFor="anim-typewriter" className="text-sm font-normal cursor-pointer">
                                Typewriter
                            </Label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fade" id="anim-fade" />
                            <Label htmlFor="anim-fade" className="text-sm font-normal cursor-pointer">
                                Fade In
                            </Label>
                        </div>
                    </div>
                </RadioGroup>
            </div>

            {/* Animation Settings (only when enabled) */}
            {animation.enabled && (
                <div className="space-y-3 rounded-md border p-2.5">
                    <p className="text-xs font-medium text-muted-foreground">⚙️ Settings</p>

                    {/* Speed */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Speed</Label>
                            <span className="text-xs text-muted-foreground">{animation.speed} chars/sec</span>
                        </div>
                        <Slider
                            value={[animation.speed]}
                            onValueChange={([value]) => setAnimationSpeed(value)}
                            min={ANIMATION_SPEED_RANGE.min}
                            max={ANIMATION_SPEED_RANGE.max}
                            step={5}
                            className="w-full"
                        />
                    </div>

                    {/* Delay */}
                    <div className="space-y-1.5">
                        <Label className="text-xs">Start Delay</Label>
                        <div className="flex gap-1.5">
                            {[0, 0.5, 1].map((delay) => (
                                <Button
                                    key={delay}
                                    variant={animation.delay === delay ? 'secondary' : 'outline'}
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => setAnimationDelay(delay)}
                                >
                                    {delay}s
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Loop & Cursor */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="loop" className="text-xs">Loop animation</Label>
                            <Switch
                                id="loop"
                                checked={animation.loop}
                                onCheckedChange={setAnimationLoop}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="cursor" className="text-xs">Show cursor</Label>
                            <Switch
                                id="cursor"
                                checked={animation.showCursor}
                                onCheckedChange={setShowCursor}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Estimate */}
            <div className="rounded-md border p-2.5 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">📊 Estimate</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{estimatedDuration.toFixed(1)}s</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Frames</p>
                        <p className="font-medium">{estimatedFrames}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">~2.1MB</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
