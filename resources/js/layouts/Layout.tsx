import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

export default function Layout({ children }) {
    const [isDark, setIsDark] = useState(true)

    // Keep local state in sync so bg class updates reactively
    useEffect(() => {
        const update = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }

        // Initial read
        update()

        // Watch for class changes on <html>
        const observer = new MutationObserver(update)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className={isDark ? 'dark' : ''}>
            <Navbar />
            <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300">
                <div className="max-w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
