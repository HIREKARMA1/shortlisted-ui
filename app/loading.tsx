import { Loader } from "@/components/ui/loader"

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#1a1f2e] z-50">
            <Loader size="lg" className="border-[#00a2e5] border-t-transparent" />
        </div>
    )
}

