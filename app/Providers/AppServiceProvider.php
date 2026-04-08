<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::define('admin', function ($user) {
            return in_array($user->role, ['admin', 'super_admin']);
        });

        Gate::define('super_admin', function ($user) {
            return $user->role === 'super_admin';
        });

        // Optimization: Log slow queries (> 500ms) for performance tuning
        \Illuminate\Support\Facades\DB::listen(function ($query) {
            if ($query->time > 500) {
                \Illuminate\Support\Facades\Log::warning('Slow query detected', [
                    'sql' => $query->sql,
                    'time' => $query->time,
                    'bindings' => $query->bindings
                ]);
            }
        });
    }
}
