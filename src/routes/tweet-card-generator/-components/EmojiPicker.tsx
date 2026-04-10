import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Smile, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void
    className?: string
}

const EMOJI_CATEGORIES = {
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
    'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
    'Objects': ['🔥', '💯', '✨', '⭐', '🌟', '💫', '🎉', '🎊', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎯', '🚀', '💡', '💰', '💵', '💎', '📱', '💻', '⌨️', '🖥️', '🎮', '🎧', '📷', '📸', '🎬', '🎤', '🎵', '🎶', '📚', '📖', '✏️', '📝', '📌', '📎', '🔗', '⚡'],
    'Nature': ['🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '💨', '💧', '💦', '🌊', '🌸', '🌺', '🌻', '🌹', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🍀', '🍁', '🍂', '🍃'],
    'Food': ['🍕', '🍔', '🍟', '🌭', '🍿', '🥤', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '☕', '🍵', '🧋', '🍺', '🍷', '🥂', '🍾', '🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🫐', '🥑', '🥕'],
    'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌'],
    'Activities': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️'],
}

export function EmojiPicker({ onEmojiSelect, className }: EmojiPickerProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('Smileys')

    const allEmojis = Object.values(EMOJI_CATEGORIES).flat()
    
    const filteredEmojis = search
        ? allEmojis.filter(() => true) // In a real app, you'd filter by emoji name
        : EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES] || []

    const handleEmojiClick = (emoji: string) => {
        onEmojiSelect(emoji)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8 shrink-0', className)}
                    type="button"
                >
                    <Smile className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-80 p-0" 
                align="start"
                side="top"
            >
                {/* Search */}
                <div className="p-2 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search emojis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8 pl-8 text-sm"
                        />
                    </div>
                </div>

                {/* Category tabs */}
                {!search && (
                    <div className="flex gap-1 p-2 border-b overflow-x-auto">
                        {Object.keys(EMOJI_CATEGORIES).map((category) => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? 'secondary' : 'ghost'}
                                size="sm"
                                className="h-7 px-2 text-xs shrink-0"
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Emoji grid */}
                <div className="grid grid-cols-8 gap-0.5 p-2 max-h-60 overflow-y-auto">
                    {filteredEmojis.map((emoji, index) => (
                        <button
                            key={`${emoji}-${index}`}
                            type="button"
                            className="h-8 w-8 flex items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            onClick={() => handleEmojiClick(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {/* Recently used - placeholder */}
                <div className="p-2 border-t text-xs text-muted-foreground text-center">
                    Click an emoji to insert
                </div>
            </PopoverContent>
        </Popover>
    )
}

