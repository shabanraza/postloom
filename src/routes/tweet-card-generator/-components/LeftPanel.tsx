import {
    ProfileSection,
    TweetTextSection,
    ReplyToSection,
    MetricsAndTimeSection,
} from './sections'

export function LeftPanel() {
    return (
        <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-r border-slate-200/60 dark:border-slate-800/60 bg-transparent z-20">
            {/* Scrollable Content Area - Single Card */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft-sm border border-slate-100 dark:border-slate-800 p-3 space-y-3">
                    <ProfileSection />
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    <TweetTextSection />
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    <MetricsAndTimeSection />
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    <ReplyToSection />
                </div>
            </div>
        </aside>
    )
}
