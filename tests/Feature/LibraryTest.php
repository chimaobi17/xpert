<?php

use App\Models\AiAgent;
use App\Models\PromptLibrary;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->agent = AiAgent::create([
        'name' => 'Library Test Agent',
        'domain' => 'Technology',
        'category' => 'test',
        'system_prompt' => 'Test.',
        'is_premium_only' => false,
    ]);
});

test('user can save a prompt to library', function () {
    $response = $this->actingAs($this->user)->postJson('/api/library', [
        'agent_id' => $this->agent->id,
        'original_input' => '{"topic": "test"}',
        'final_prompt' => 'Test prompt about test',
        'ai_response' => 'This is a test response.',
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('prompt_library', [
        'user_id' => $this->user->id,
        'agent_id' => $this->agent->id,
    ]);
});

test('user can list their saved prompts', function () {
    PromptLibrary::create([
        'user_id' => $this->user->id,
        'agent_id' => $this->agent->id,
        'original_input' => '{}',
        'final_prompt' => 'Saved prompt',
        'ai_response' => 'Saved response',
    ]);

    $response = $this->actingAs($this->user)->getJson('/api/library');

    $response->assertStatus(200)
        ->assertJsonCount(1);
});

test('user cannot see other users library items', function () {
    $otherUser = User::factory()->create();
    PromptLibrary::create([
        'user_id' => $otherUser->id,
        'agent_id' => $this->agent->id,
        'original_input' => '{}',
        'final_prompt' => 'Other user prompt',
        'ai_response' => 'Other response',
    ]);

    $response = $this->actingAs($this->user)->getJson('/api/library');

    $response->assertStatus(200)
        ->assertJsonCount(0);
});

test('user can delete their saved prompt', function () {
    $item = PromptLibrary::create([
        'user_id' => $this->user->id,
        'agent_id' => $this->agent->id,
        'original_input' => '{}',
        'final_prompt' => 'To delete',
        'ai_response' => 'Will be deleted',
    ]);

    $response = $this->actingAs($this->user)->deleteJson("/api/library/{$item->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('prompt_library', ['id' => $item->id]);
});
