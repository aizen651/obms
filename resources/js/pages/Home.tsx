import { Head } from "@inertiajs/react"
import { useState } from "react"
import { MessageCircle, ChevronDown, BookOpen, Repeat, CreditCard, LayoutDashboard, Library, Newspaper } from "lucide-react"
import Navbar from "@/components/Navbar"

const TILES = [
    { Icon: Library,         label: "My Books"     },
    { Icon: Repeat,          label: "Borrow"       },
    { Icon: CreditCard,      label: "Transactions" },
    { Icon: Newspaper,       label: "Journal"      },
    { Icon: LayoutDashboard, label: "Magazines"    },
    { Icon: BookOpen,        label: "E-Books"      },
]

const CARDS = [
    { title: "Journals",  desc: "Access academic journals and research papers", btn: "Browse Journals"  },
    { title: "Magazines", desc: "Read the latest magazines and publications",   btn: "View Magazines"   },
    { title: "E-Books",   desc: "Explore our extensive collection of e-books",  btn: "Explore E-Books"  },
]

export default function Landing() {
    const [hovered, setHovered] = useState(false)

    return (
        <>
            <Head title="Library System" />
            <div className="flex flex-col min-h-screen w-full bg-gray-50 text-gray-800 selection:bg-emerald-200 overflow-x-hidden">

                <Navbar />

                {/* Hero */}
                <section className="relative w-full h-[550px] md:h-[650px] flex items-center justify-center overflow-hidden">

                    {/* Background — GPU-composited, state-driven scale to eliminate lag */}
                    <div
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000')",
                            transform: hovered ? "scale(1.05) translateZ(0)" : "scale(1) translateZ(0)",
                            transition: "transform 600ms ease-out",
                            willChange: "transform",
                        }}
                        className="absolute inset-0 bg-cover bg-center"
                    />

                    {/* Light overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/90" />
                    <div className="absolute inset-0 bg-emerald-100/20 mix-blend-multiply" />

                    <div className="relative z-10 text-center px-4 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-sm text-gray-800">
                            Welcome to the <span className="text-emerald-600">Library System</span>
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 font-light italic">
                            "Discover, Borrow, and Enjoy Your Favorite Books!"
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-200 active:scale-95">
                                Explore Books
                            </button>
                            <button className="px-8 py-3 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-lg font-bold hover:bg-white transition-colors border border-emerald-200 active:scale-95">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Arc */}
                    <div className="absolute bottom-0 left-0 w-full leading-none z-20">
                        <svg className="relative block w-full h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#f9fafb" opacity=".25" />
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.51,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#f9fafb" opacity=".5" />
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f9fafb" />
                        </svg>
                    </div>
                </section>

                {/* Tiles */}
                <section className="relative z-30 -mt-16 px-4 sm:px-12">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {TILES.map(({ Icon, label }) => (
                            <div key={label} className="group bg-white border border-gray-200 p-6 rounded-2xl flex flex-col items-center gap-3 hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 cursor-pointer hover:-translate-y-2 shadow-sm hover:shadow-emerald-200/50 hover:shadow-lg">
                                <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                                    <Icon size={24} className="text-emerald-600 group-hover:text-white" />
                                </div>
                                <span className="text-sm font-bold tracking-wide text-gray-700 group-hover:text-white">{label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feature Cards */}
                <section className="px-4 sm:px-12 py-20">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CARDS.map(({ title, desc, btn }) => (
                            <div key={title} className="bg-white p-8 rounded-3xl border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:border-emerald-200 transition-all duration-300 shadow-sm">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
                                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">{desc}</p>
                                    <button className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-full text-sm font-bold border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                                        {btn} <ChevronDown size={16} />
                                    </button>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl group-hover:bg-emerald-200 transition-all" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Chat Button */}
                <button className="fixed bottom-8 right-8 z-[90] bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-emerald-200 transition-colors border border-emerald-500">
                    <MessageCircle size={20} />
                    <span className="font-bold text-sm">Chat with Us</span>
                </button>

            </div>
        </>
    )
}