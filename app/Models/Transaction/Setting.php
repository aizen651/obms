<?php

namespace App\Models\Transaction;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    protected $casts = [
        'value' => 'json',
    ];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, string $description = null): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'description' => $description,
            ]
        );
    }

    /**
     * Get late fee configuration
     */
    public static function getLateFeeConfig()
    {
        return self::get('late_fee_config', [
            'enabled' => false,
            'rate' => 0,
            'interval' => 'day', // second, minute, hour, day, week, month, year
        ]);
    }

    /**
     * Calculate late fee for a transaction
     */
    public static function calculateLateFee($expectedReturnDate, $actualReturnDate = null)
    {
        $config = self::getLateFeeConfig();
        
        if (!$config['enabled'] || $config['rate'] <= 0) {
            return 0;
        }

        $returnDate = $actualReturnDate ? new \DateTime($actualReturnDate) : new \DateTime();
        $expectedDate = new \DateTime($expectedReturnDate);

        // If not overdue, no fee
        if ($returnDate <= $expectedDate) {
            return 0;
        }

        $interval = $returnDate->diff($expectedDate);
        $units = 0;

        switch ($config['interval']) {
            case 'second':
                $units = ($returnDate->getTimestamp() - $expectedDate->getTimestamp());
                break;
            case 'minute':
                $units = ceil(($returnDate->getTimestamp() - $expectedDate->getTimestamp()) / 60);
                break;
            case 'hour':
                $units = ceil(($returnDate->getTimestamp() - $expectedDate->getTimestamp()) / 3600);
                break;
            case 'day':
                $units = $interval->days;
                break;
            case 'week':
                $units = ceil($interval->days / 7);
                break;
            case 'month':
                $units = ($interval->y * 12) + $interval->m;
                break;
            case 'year':
                $units = $interval->y;
                break;
        }

        return round($units * $config['rate'], 2);
    }
}
