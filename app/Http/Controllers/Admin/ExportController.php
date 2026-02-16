<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Book;
use App\Models\Transaction;
use App\Models\Category;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Action/Export', [
            'counts' => [
                'users' => User::count(),
                'books' => Book::count(),
                'transactions' => Transaction::count(),
                'categories' => Category::count(),
            ]
        ]);
    }

    public function exportUsers()
    {
        return $this->exportToCsv(
            User::all(),
            'users_' . now()->format('Y-m-d'),
            ['id', 'firstname', 'lastname', 'email', 'role', 'student_id', 'teacher_id', 'contact', 'created_at']
        );
    }

    public function exportBooks()
    {
        return $this->exportToCsv(
            Book::with('category')->get(),
            'books_' . now()->format('Y-m-d'),
            ['id', 'title', 'isbn', 'author', 'publisher', 'category.name', 'total_copies', 'available_copies', 'status', 'created_at']
        );
    }

    public function exportTransactions()
    {
        return $this->exportToCsv(
            Transaction::with(['book', 'borrower'])->get(),
            'transactions_' . now()->format('Y-m-d'),
            ['id', 'ref_nbr', 'book.title', 'borrower.firstname', 'borrower.lastname', 'quantity', 'date_borrowed', 'expected_return_date', 'date_returned', 'status', 'fees', 'is_lost']
        );
    }

    public function exportAll()
    {
        $zip = new \ZipArchive();
        $zipFileName = storage_path('app/public/export_all_' . now()->format('Y-m-d_His') . '.zip');
        
        if ($zip->open($zipFileName, \ZipArchive::CREATE) !== TRUE) {
            return back()->with('error', 'Could not create zip file');
        }

        $this->addCsvToZip($zip, User::all(), 'users', ['id', 'firstname', 'lastname', 'email', 'role', 'student_id', 'teacher_id', 'contact', 'created_at']);
        $this->addCsvToZip($zip, Book::with('category')->get(), 'books', ['id', 'title', 'isbn', 'author', 'publisher', 'category.name', 'total_copies', 'available_copies', 'status', 'created_at']);
        $this->addCsvToZip($zip, Transaction::with(['book', 'borrower'])->get(), 'transactions', ['id', 'ref_nbr', 'book.title', 'borrower.firstname', 'borrower.lastname', 'quantity', 'date_borrowed', 'expected_return_date', 'date_returned', 'status', 'fees', 'is_lost']);
        $this->addCsvToZip($zip, Category::withCount('books')->get(), 'categories', ['id', 'name', 'description', 'books_count', 'created_at']);

        $zip->close();

        return response()->download($zipFileName)->deleteFileAfterSend(true);
    }

    private function exportToCsv($data, $filename, $columns)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.csv"',
        ];

        return new StreamedResponse(function() use ($data, $columns) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, array_map(fn($col) => str_replace('.', '_', $col), $columns));
            foreach ($data as $row) {
                $csvRow = [];
                foreach ($columns as $column) {
                    $csvRow[] = data_get($row, $column);
                }
                fputcsv($handle, $csvRow);
            }
            fclose($handle);
        }, 200, $headers);
    }

    private function addCsvToZip($zip, $data, $name, $columns)
    {
        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, array_map(fn($col) => str_replace('.', '_', $col), $columns));
        foreach ($data as $row) {
            $csvRow = [];
            foreach ($columns as $column) {
                $csvRow[] = data_get($row, $column);
            }
            fputcsv($csv, $csvRow);
        }
        rewind($csv);
        $zip->addFromString($name . '.csv', stream_get_contents($csv));
        fclose($csv);
    }
}