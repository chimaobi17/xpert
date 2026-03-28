<?php

use App\Models\User;
use App\Models\AiAgent;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->superAdmin = User::factory()->create(['role' => 'super_admin']);
    $this->regularUser = User::factory()->create(['role' => 'user']);
});

test('admin can access admin stats', function () {
    $response = $this->actingAs($this->admin)->getJson('/api/admin/stats');

    $response->assertStatus(200)
        ->assertJsonStructure(['total_users', 'total_prompts_today', 'active_agents']);
});

test('regular user cannot access admin routes', function () {
    $response = $this->actingAs($this->regularUser)->getJson('/api/admin/stats');

    $response->assertStatus(403);
});

test('admin can list all users', function () {
    $response = $this->actingAs($this->admin)->getJson('/api/admin/users');

    $response->assertStatus(200)
        ->assertJsonCount(3);
});

test('admin can view a user', function () {
    $response = $this->actingAs($this->admin)->getJson("/api/admin/users/{$this->regularUser->id}");

    $response->assertStatus(200)
        ->assertJson(['email' => $this->regularUser->email]);
});

test('admin can update user plan', function () {
    $response = $this->actingAs($this->admin)->patchJson("/api/admin/users/{$this->regularUser->id}", [
        'plan_level' => 'premium',
    ]);

    $response->assertStatus(200);
    expect($this->regularUser->fresh()->plan_level)->toBe('premium');
});

test('admin can block a user', function () {
    $response = $this->actingAs($this->admin)->putJson("/api/admin/users/{$this->regularUser->id}/block", [
        'duration' => '7d',
        'reason' => 'Violated terms of service multiple times',
    ]);

    $response->assertStatus(200);
    expect($this->regularUser->fresh()->ban_reason)->toBe('Violated terms of service multiple times');
    expect($this->regularUser->fresh()->banned_until)->not->toBeNull();
});

test('admin can unblock a user', function () {
    $this->regularUser->update(['banned_until' => now()->addWeek(), 'ban_reason' => 'Test']);

    $response = $this->actingAs($this->admin)->putJson("/api/admin/users/{$this->regularUser->id}/unblock");

    $response->assertStatus(200);
    expect($this->regularUser->fresh()->ban_reason)->toBeNull();
    expect($this->regularUser->fresh()->banned_until)->toBeNull();
});

test('only super admin can promote users', function () {
    // Admin cannot promote
    $response = $this->actingAs($this->admin)->putJson("/api/admin/users/{$this->regularUser->id}/promote", [
        'role' => 'admin',
    ]);
    $response->assertStatus(403);

    // Super admin can promote
    $response = $this->actingAs($this->superAdmin)->putJson("/api/admin/users/{$this->regularUser->id}/promote", [
        'role' => 'admin',
    ]);
    $response->assertStatus(200);
    expect($this->regularUser->fresh()->role)->toBe('admin');
});

test('super admin cannot promote themselves', function () {
    $response = $this->actingAs($this->superAdmin)->putJson("/api/admin/users/{$this->superAdmin->id}/promote", [
        'role' => 'user',
    ]);

    $response->assertStatus(403)
        ->assertJson(['error' => 'You cannot modify your own role.']);
});

test('super admin cannot modify another super admin', function () {
    $anotherSuperAdmin = User::factory()->create(['role' => 'super_admin']);

    $response = $this->actingAs($this->superAdmin)->putJson("/api/admin/users/{$anotherSuperAdmin->id}/promote", [
        'role' => 'user',
    ]);

    $response->assertStatus(403)
        ->assertJson(['error' => 'Cannot modify a super admin.']);
});

test('only super admin can delete users', function () {
    $toDelete = User::factory()->create();

    // Admin cannot delete
    $response = $this->actingAs($this->admin)->deleteJson("/api/admin/users/{$toDelete->id}");
    $response->assertStatus(403);

    // Super admin can delete
    $response = $this->actingAs($this->superAdmin)->deleteJson("/api/admin/users/{$toDelete->id}");
    $response->assertStatus(200);
    $this->assertDatabaseMissing('users', ['id' => $toDelete->id]);
});

test('super admin cannot delete themselves', function () {
    $response = $this->actingAs($this->superAdmin)->deleteJson("/api/admin/users/{$this->superAdmin->id}");

    $response->assertStatus(403)
        ->assertJson(['error' => 'You cannot delete your own account.']);
});

test('admin can list agents', function () {
    AiAgent::create([
        'name' => 'Admin Test Agent',
        'domain' => 'Technology',
        'category' => 'test',
        'system_prompt' => 'Test.',
        'is_premium_only' => false,
    ]);

    $response = $this->actingAs($this->admin)->getJson('/api/admin/agents');

    $response->assertStatus(200);
});

test('admin can create an agent', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/admin/agents', [
        'name' => 'New Agent',
        'domain' => 'Creative',
        'category' => 'new_test',
        'system_prompt' => 'You are a new test agent.',
    ]);

    $response->assertStatus(201)
        ->assertJson(['name' => 'New Agent']);
});

test('admin can view prompt logs', function () {
    $response = $this->actingAs($this->admin)->getJson('/api/admin/logs');

    $response->assertStatus(200);
});
