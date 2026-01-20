import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { OptimizedImage } from "@/components/ui/optimized-image"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center max-w-2xl w-full">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 gradient-text">
                        Welcome to Shortlisted
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Your modern platform is ready to build
                    </p>
                    
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Project Setup Complete</CardTitle>
                            <CardDescription>
                                Your Next.js project with TypeScript and Tailwind CSS is ready
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Next.js 14 with App Router</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm">TypeScript configured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Tailwind CSS with dark mode</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Component-based architecture</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Optimized images with lazy loading & skeleton</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Example: Optimized Image Component (with skeleton loader)
                                </p>
                                <div className="flex justify-center">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop"
                                        alt="Example optimized image"
                                        width={400}
                                        height={300}
                                        variant="rounded"
                                        aspectRatio="video"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-4 justify-center">
                                <Button>Get Started</Button>
                                <Button variant="outline">View Docs</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

