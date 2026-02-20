import Navbar from '@/components/Navbar'

export default function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-slate-800 to-slate-700 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-full">
                    {children}
                </div>
            </main>
        </>
    )
}