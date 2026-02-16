<?php

namespace App\Http\Controllers\Admin\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Transaction\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $lateFeeConfig = Setting::getLateFeeConfig();

        return Inertia::render('Admin/Transaction/Settings', [
            'lateFeeConfig' => $lateFeeConfig,
        ]);
    }

    public function updateLateFees(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'rate' => ['required', 'numeric', 'min:0'],
            'interval' => ['required', 'in:second,minute,hour,day,week,month,year'],
        ]);

        Setting::set('late_fee_config', $validated, 'Late fee configuration for overdue books');

        return back()->with('success', 'Late fee settings updated successfully!');
    }
}
