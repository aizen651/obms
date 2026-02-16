import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminAuthLayout from '@/layouts/AdminAuthLayout';
import { toast } from 'sonner';
import { 
    DollarSign,
    Clock,
    Settings as SettingsIcon,
    Save,
    Info
} from 'lucide-react';

export default function Settings({ lateFeeConfig }) {
    const [enabled, setEnabled] = useState(lateFeeConfig.enabled || false);
    const [rate, setRate] = useState(lateFeeConfig.rate || 0);
    const [interval, setInterval] = useState(lateFeeConfig.interval || 'day');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);

        router.post('/admin/settings/late-fees', {
            enabled,
            rate: parseFloat(rate),
            interval,
        }, {
            onSuccess: () => {
                toast.success('Late fee settings updated successfully!');
            },
            onError: (errors) => {
                toast.error('Failed to update settings.');
                console.error(errors);
            },
            onFinish: () => {
                setIsSaving(false);
            }
        });
    };

    const intervalOptions = [
        { value: 'second', label: 'Second', example: '60 seconds = ₱' + (rate * 60).toFixed(2) },
        { value: 'minute', label: 'Minute', example: '60 minutes = ₱' + (rate * 60).toFixed(2) },
        { value: 'hour', label: 'Hour', example: '24 hours = ₱' + (rate * 24).toFixed(2) },
        { value: 'day', label: 'Day', example: '7 days = ₱' + (rate * 7).toFixed(2) },
        { value: 'week', label: 'Week', example: '4 weeks = ₱' + (rate * 4).toFixed(2) },
        { value: 'month', label: 'Month', example: '3 months = ₱' + (rate * 3).toFixed(2) },
        { value: 'year', label: 'Year', example: '2 years = ₱' + (rate * 2).toFixed(2) },
    ];

    return (
        <AdminAuthLayout header="Settings">
            <Head title="Settings - Late Fees" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <SettingsIcon className="w-6 h-6 text-amber-600" />
                        Late Fee Configuration
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Configure automatic late fee calculation for overdue books
                    </p>
                </div>

                {/* Settings Card */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                    {/* Enable/Disable */}
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                enabled 
                                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' 
                                    : 'bg-gray-200 text-gray-500'
                            }`}>
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Enable Late Fees</h3>
                                <p className="text-sm text-gray-600">
                                    Automatically calculate fees for overdue books
                                </p>
                            </div>
                        </div>
                        <button
    onClick={() => setEnabled(!enabled)}
    className={`relative w-14 h-7 rounded-full overflow-hidden flex-shrink-0 transition-colors duration-300
        ${enabled ? 'bg-amber-500' : 'bg-gray-300'}
    `}
>
    <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300
            ${enabled ? 'translate-x-7' : ''}
        `}
    />
</button>
                    </div>

                    {/* Fee Rate */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Fee Rate (PHP)
                        </label>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            min="0"
                            step="0.01"
                            disabled={!enabled}
                            className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                !enabled ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                            placeholder="5.00"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                            Amount charged per time interval
                        </p>
                    </div>

                    {/* Time Interval */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Time Interval
                        </label>
                        <select
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            disabled={!enabled}
                            className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none ${
                                !enabled ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                        >
                            {intervalOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-600 mt-2">
                            Fee will be charged for each {interval} overdue
                        </p>
                    </div>

                    {/* Preview/Examples */}
                    {enabled && rate > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-blue-900 mb-2">Fee Calculation Examples</h4>
                                    <div className="space-y-1 text-sm text-blue-800">
                                        {intervalOptions
                                            .filter(opt => opt.value === interval)
                                            .map(opt => (
                                                <p key={opt.value}>
                                                    <span className="font-medium">₱{rate}</span> per {opt.label.toLowerCase()} · Example: {opt.example}
                                                </p>
                                            ))
                                        }
                                    </div>
                                    <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                                        <p className="text-sm text-blue-900 font-medium mb-1">Sample Scenario:</p>
                                        <p className="text-sm text-blue-800">
                                            Book due: Feb 16, 2026<br />
                                            Book returned: Feb 23, 2026 (7 {interval}s overdue)<br />
                                            <span className="font-bold">Late Fee: ₱{(rate * 7).toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* How it Works */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">How Automatic Fees Work</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">1.</span>
                                <span>When a book is overdue, the system calculates how many {interval}s have passed since the expected return date</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">2.</span>
                                <span>The fee is automatically calculated: {interval}s overdue × ₱{rate} = total fee</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">3.</span>
                                <span>Fees update in real-time when viewing transaction details</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">4.</span>
                                <span>No fee is charged if the book is returned on time or early</span>
                            </li>
                        </ul>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                            <p className="font-semibold mb-1">Important Notes:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Changing these settings will affect all future late fee calculations</li>
                                <li>Existing transactions with manually set fees will not be affected</li>
                                <li>You can still manually override fees on individual transactions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthLayout>
    );
}
