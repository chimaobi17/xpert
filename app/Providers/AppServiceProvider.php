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
    }
}
