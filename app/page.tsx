import { ThemeToggle } from "@/components/ui/theme-toggle"
import WhoCanJoin from "@/components/home/WhoCanJoin"
import WhatMakesDifferent from "@/components/home/WhatMakesDifferent"
import WhatYouWalkAwayWith from "@/components/home/WhatYouWalkAwayWith"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <WhoCanJoin />
            <WhatMakesDifferent />
            <WhatYouWalkAwayWith />
        </div>
    )
}

