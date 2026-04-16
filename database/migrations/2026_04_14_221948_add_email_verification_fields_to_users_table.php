<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false)->after('two_factor_enabled');
            $table->string('otp_code', 6)->nullable()->after('is_verified');
            $table->timestamp('otp_expires_at')->nullable()->after('otp_code');
            $table->string('reset_token')->nullable()->after('otp_expires_at');
            $table->timestamp('reset_token_expires_at')->nullable()->after('reset_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_verified', 'otp_code', 'otp_expires_at', 'reset_token', 'reset_token_expires_at']);
        });
    }
};
