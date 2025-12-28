import { Check } from 'lucide-react'
import { useTweetStudioStore } from '../../-state'
import { TEMPLATES } from '../../-constants'
import { cn } from '../../-utils'

export function TemplatesTab() {
    const { design, setTemplateId } = useTweetStudioStore()

    return (
        <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
                Choose a style for your tweet card
            </p>

            <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((template) => {
                    const isActive = design.templateId === template.id

                    return (
                        <button
                            key={template.id}
                            type="button"
                            className={cn(
                                'relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all',
                                isActive
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                    : 'border-border bg-card/50 hover:bg-muted/50 hover:border-muted-foreground/30'
                            )}
                            onClick={() => setTemplateId(template.id)}
                        >
                            {/* Preview Box */}
                            <div
                                className="w-full h-12 rounded-md bg-muted/50 border flex items-center justify-center"
                                style={{
                                    borderRadius: Math.min(template.borderRadius / 2, 8),
                                    boxShadow: template.shadow === 'none' ? 'none' :
                                        template.shadow === 'soft' ? '0 2px 4px rgba(0,0,0,0.1)' :
                                            template.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                                                template.shadow === 'hard' ? '4px 4px 0 0 #000' :
                                                    '0 0 12px rgba(59,130,246,0.5)',
                                    fontFamily: template.fontFamily,
                                }}
                            >
                                <div
                                    className="text-xs text-muted-foreground"
                                    style={{ fontWeight: template.fontWeight }}
                                >
                                    Aa
                                </div>
                            </div>

                            {/* Label */}
                            <div className="flex items-center gap-1.5 w-full">
                                <span className="text-xs font-medium truncate flex-1">{template.name}</span>
                                {isActive && (
                                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
