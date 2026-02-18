import { useState, useEffect } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
DropdownMenuLabel,
DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem, 
DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { 
  Plus,
  Search,
  Filter,
  Trash2,
  BookCheck,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Eye
  } from 'lucide-react';
import GuestLayout from '@/layouts/GuestLayout';


export default function Books({ books, categories, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [showFilters, setShowFilters] = useState(false);
    
    const DEBOUNCE_DELAY = 500;

    useEffect(() => {
        const handler = setTimeout(() => {
            router.get('/books', {
                search,
                category: categoryFilter,
                status: statusFilter,
                sort: filters?.sort,
                direction: filters?.direction,
            }, {
                preserveState: true,
                replace: true,
            });
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [search, categoryFilter, statusFilter]);

    const handleSort = (column) => {
        const direction = filters?.sort === column && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get('/books', { search, category: categoryFilter, status: statusFilter, sort: column, direction }, { preserveState: true });
    };
    
     const SortIcon = ({ column }) => {
        if (filters?.sort !== column) return null;
        return filters?.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    const handleReset = () => {
        setSearch('');
        setCategoryFilter('');
        setStatusFilter('');
        router.get('/books');
    };
     // Updated StatusBadge to use display_status
    const StatusBadge = ({ book }) => {
        const displayStatus = book.display_status || book.status;
        const styles = {
            available: 'bg-green-50 text-green-700 border-green-200',
            unavailable: 'bg-red-50 text-red-700 border-red-200',
            archived: 'bg-gray-50 text-gray-700 border-gray-200'
        };
        return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[displayStatus]}`}>
                {displayStatus}
            </span>
        );
    };
  return (
    <>
      <GuestLayout>
      <Head title="Books"/>
        
        <div className="space-y-4 pt-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl text-white font-bold">All Books</h2>
              <p className="text-sm text-white">{books.total} total books</p>
            </div>
        </div>
        
        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search books..."
                            className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                        />
        </div>
      <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium">
                                    <Filter className="w-4 h-4" />
                      Filters
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>All Categories</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <DropdownMenuRadioItem value="">All Categories</DropdownMenuRadioItem>
                      {categories.map(cat => <DropdownMenuRadioItem key={cat.id} value={cat.id}>{cat.name}</DropdownMenuRadioItem>)}        
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                                    <DropdownMenuRadioItem value="">All Status</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="available">Available</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="unavailable">Unavailable</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="archived">Archived</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleReset} className="text-red-500 focus:text-red-600">Reset Filters</DropdownMenuItem>
                            </DropdownMenuContent>
              </DropdownMenu>
        </div>
      </div>
      
      {/* Responsive Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white shadow-lg shadow-emerald-900/20">
                 <tr className="border-b border-amber-100">
                     <th className="px-4 py-3 text-left text-sm font-semibold">
                   <button onClick={() => handleSort('title')} className="flex items-center gap-1 hover:text-amber-600">
                                            Book <SortIcon column="title" />
                             </button>   
                    </th>
                     <th className="px-4 py-3 text-left text-sm font-semibold">
                   <button onClick={() => handleSort('isbn')} className="flex items-center gap-1 hover:text-amber-600">
                                            ISBN <SortIcon column="isbn" />
                             </button>   
                    </th>
                     <th className="px-4 py-3 text-left text-sm font-semibold">
                   <button onClick={() => handleSort('author')} className="flex items-center gap-1 hover:text-amber-600">
                                            Author <SortIcon column="author" />
                             </button>   
                    </th>
                     <th className="px-4 py-3 text-left text-sm font-semibold ">
                   <button onClick={() => handleSort('category')} className="flex items-center gap-1 hover:text-amber-600">
                                            Category <SortIcon column="category" />
                             </button>   
                    </th>
                     <th className="px-4 py-3 text-left text-sm font-semibold">
                   <button onClick={() => handleSort('available')} className="flex items-center gap-1 hover:text-amber-600">
                                            Available <SortIcon column="available" />
                             </button>   
                    </th>
                     <th className="px-4 py-3 text-left text-sm font-semibold ">
                      Status   
                    </th>
                     <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.data.length > 0 ? books.data.map((book) => (
                  <tr key={book.id}
                  className="hover:bg-amber-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {book.image_url ? (
                                                            <img src={book.image_url} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                                                        ) : (
                                                            <div className="w-10 h-14 rounded bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                                                <BookOpen className="w-5 h-5" />
                                                            </div>
                                                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{book.title}</div>
                      </div>
                      </div>
                    </td>
                    <td className="text-xs md:text-md px-2 py-3">
                      {book.isbn}
                    </td>
                    <td className="text-xs md:text-md px-4 py-3">
                      {book.author}
                    </td>
                    <td className="text-xs md:text-md px-4 py-3">
                      {book.category?.name || 'N/A'}
                    </td>
                    <td className="text-xs md:text-md px-4 py-3">
                       <span className={`font-semibold ${book.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {book.available_copies}
                                                        </span>
                                                        <span className="text-gray-500">/{book.total_copies}</span>
                    </td>
                    
                    <td className="text-xs md:text-md px-4 py-3">
                      <StatusBadge book={book} />
                    </td>
                    
                    <td className="text-xs md:text-md px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                                                        <Link href={route('book.show', book.id)} className="p-2 flex gap-1 bg-gray-100 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                                                            <Eye className="w-4 h-4" />
                    <span className="text-xs">View</span>
                                                        </Link>
                                                        <button onClick={() => { setBookToDelete(book); setIsDeleteModalOpen(true); }} className="p-2 flex gap-1 bg-gray-100 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Borrow">
                                                            <BookCheck className="w-4 h-4" /> 
                    <span className="text-xs">Borrow</span>
                                                        </button>
                                                    </div>
                    </td>
                  </tr>
                  )) : (
                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center">
                                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">No books found</p>
                                        </td>
                                    </tr>
                  )}
                </tbody>
            </table>
        </div>
        </div>
        {/* Pagination */}
                {books.data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-lg shadow-sm border my-4 px-4 py-3">
                        <p className="text-sm text-gray-600">
                            Showing {books.from}-{books.to} of {books.total}
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {books.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded text-sm font-medium ${
                                        link.active ? 'bg-emerald-700 text-white' : link.url ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
      </GuestLayout>
    </>
    )
}