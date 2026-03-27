<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('job_title')->nullable()->after('plan_level');
            $table->text('purpose')->nullable()->after('job_title');
            $table->string('field_of_specialization')->nullable()->after('purpose');
            $table->timestamp('banned_until')->nullable()->after('field_of_specialization');
            $table->text('ban_reason')->nullable()->after('banned_until');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['job_title', 'purpose', 'field_of_specialization', 'banned_until', 'ban_reason']);
        });
    }
};
