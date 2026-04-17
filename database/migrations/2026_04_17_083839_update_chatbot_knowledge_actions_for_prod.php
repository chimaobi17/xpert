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
        \DB::table('chatbot_knowledges')
            ->where('question', 'LIKE', '%upgrade%')
            ->update([
                'action_type' => 'navigate',
                'action_target' => '/settings?tab=plan'
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \DB::table('chatbot_knowledges')
            ->where('question', 'LIKE', '%upgrade%')
            ->update([
                'action_type' => 'modal',
                'action_target' => 'upgrade'
            ]);
    }
};
