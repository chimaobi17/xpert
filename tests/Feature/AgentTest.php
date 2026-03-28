<?php

use App\Models\AiAgent;
use App\Models\PromptTemplate;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['plan_level' => 'free']);
    $this->agent = AiAgent::create([
        'name' => 'Test Agent',
        'domain' => 'Technology',
        'category' => 'test',
        'system_prompt' => 'You are a test agent.',
        'is_premium_only' => false,
    ]);
    PromptTemplate::create([
        'agent_id' => $this->agent->id,
        'version' => 1,
        'template_body' => 'Test prompt for {{topic}}',
        'field_schema' => json_encode(['fields' => [
            ['name' => 'topic', 'type' => 'text', 'label' => 'Topic', 'required' => true],
        ]]),
    ]);
});

test('authenticated user can list agents', function () {
    $response = $this->actingAs($this->user)->getJson('/api/agents');

    $response->assertStatus(200)
        ->assertJsonCount(1);
});

test('authenticated user can view a single agent', function () {
    $response = $this->actingAs($this->user)->getJson("/api/agents/{$this->agent->id}");

    $response->assertStatus(200)
        ->assertJson(['name' => 'Test Agent']);
});

test('user can search agents by query', function () {
    $response = $this->actingAs($this->user)->getJson('/api/agents/search?q=Test');

    $response->assertStatus(200)
        ->assertJsonCount(1);
});

test('user can search agents by domain', function () {
    $response = $this->actingAs($this->user)->getJson('/api/agents/search?domain=Technology');

    $response->assertStatus(200)
        ->assertJsonCount(1);

    $response = $this->actingAs($this->user)->getJson('/api/agents/search?domain=Creative');

    $response->assertStatus(200)
        ->assertJsonCount(0);
});

test('user can add agent to workspace', function () {
    $response = $this->actingAs($this->user)->postJson("/api/user/agents/{$this->agent->id}");

    $response->assertStatus(201);
    expect($this->user->agents()->count())->toBe(1);
});

test('user cannot add same agent twice', function () {
    $this->user->agents()->attach($this->agent->id);

    $response = $this->actingAs($this->user)->postJson("/api/user/agents/{$this->agent->id}");

    $response->assertStatus(409)
        ->assertJson(['error' => 'agent_already_added']);
});

test('free user cannot add more than 3 agents', function () {
    // Create and add 3 agents
    for ($i = 0; $i < 3; $i++) {
        $a = AiAgent::create([
            'name' => "Agent $i",
            'domain' => 'Technology',
            'category' => 'test',
            'system_prompt' => 'Test',
            'is_premium_only' => false,
        ]);
        $this->user->agents()->attach($a->id);
    }

    $response = $this->actingAs($this->user)->postJson("/api/user/agents/{$this->agent->id}");

    $response->assertStatus(402)
        ->assertJson(['error' => 'agent_limit_reached']);
});

test('premium user can add unlimited agents', function () {
    $premiumUser = User::factory()->create(['plan_level' => 'premium']);

    for ($i = 0; $i < 5; $i++) {
        $a = AiAgent::create([
            'name' => "Premium Agent $i",
            'domain' => 'Technology',
            'category' => 'test',
            'system_prompt' => 'Test',
            'is_premium_only' => false,
        ]);
        $premiumUser->agents()->attach($a->id);
    }

    $response = $this->actingAs($premiumUser)->postJson("/api/user/agents/{$this->agent->id}");

    $response->assertStatus(201);
});

test('free user cannot add premium agent', function () {
    $premiumAgent = AiAgent::create([
        'name' => 'Premium Only Agent',
        'domain' => 'Creative',
        'category' => 'premium_test',
        'system_prompt' => 'Premium only.',
        'is_premium_only' => true,
    ]);

    $response = $this->actingAs($this->user)->postJson("/api/user/agents/{$premiumAgent->id}");

    $response->assertStatus(402)
        ->assertJson(['error' => 'premium_required']);
});

test('user can remove agent from workspace', function () {
    $this->user->agents()->attach($this->agent->id);

    $response = $this->actingAs($this->user)->deleteJson("/api/user/agents/{$this->agent->id}");

    $response->assertStatus(200);
    expect($this->user->agents()->count())->toBe(0);
});

test('user can generate prompt from agent template', function () {
    $response = $this->actingAs($this->user)->postJson("/api/agents/{$this->agent->id}/generate", [
        'fields' => ['topic' => 'machine learning'],
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['prompt']);
});
