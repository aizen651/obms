import Navbar from '@/components/Navbar'

export default function GuestLayout({ children }) {
  
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-full">
           {children}
          </div>
        </main>
    </>
    )
}