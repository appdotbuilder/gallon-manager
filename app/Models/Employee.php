<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

/**
 * App\Models\Employee
 *
 * @property int $id
 * @property string $employee_id
 * @property string $name
 * @property int $remaining_quota
 * @property \Illuminate\Support\Carbon $quota_last_reset
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GallonTransaction> $transactions
 * @property-read int|null $transactions_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee query()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereQuotaLastReset($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereRemainingQuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereUpdatedAt($value)
 * @method static \Database\Factories\EmployeeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'name',
        'remaining_quota',
        'quota_last_reset',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quota_last_reset' => 'date',
        'remaining_quota' => 'integer',
    ];

    /**
     * Get all transactions for this employee.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(GallonTransaction::class);
    }

    /**
     * Check if quota needs to be reset and reset if necessary.
     */
    public function checkAndResetQuota(): void
    {
        $today = Carbon::today();
        $firstDayOfMonth = $today->copy()->startOfMonth();
        
        if ($this->quota_last_reset->lt($firstDayOfMonth)) {
            $this->update([
                'remaining_quota' => 10,
                'quota_last_reset' => $firstDayOfMonth,
            ]);
        }
    }

    /**
     * Take gallons from quota.
     */
    public function takeGallons(int $quantity): bool
    {
        $this->checkAndResetQuota();
        
        if ($this->remaining_quota >= $quantity) {
            $this->decrement('remaining_quota', $quantity);
            
            // Record transaction
            $this->transactions()->create([
                'quantity' => $quantity,
                'remaining_quota_after' => $this->remaining_quota,
                'taken_at' => now(),
            ]);
            
            return true;
        }
        
        return false;
    }
}