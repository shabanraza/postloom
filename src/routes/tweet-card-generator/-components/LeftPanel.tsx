import {
    ProfileSection,
    TweetTextSection,
    ReplyToSection,
    MetricsAndTimeSection,
} from './sections'

export function LeftPanel() {
    return (
        <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-r border-border/60 bg-transparent z-20">
            {/* Scrollable Content Area - Single Card */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="bg-card rounded-xl shadow-soft-sm border border-border p-3 space-y-3">
                    <ProfileSection />
                    <div className="h-px bg-muted" />
                    <TweetTextSection />
                    <div className="h-px bg-muted" />
                    <MetricsAndTimeSection />
                    <div className="h-px bg-muted" />
                    <ReplyToSection />
                </div>
            </div>
        </aside>
    )
}
