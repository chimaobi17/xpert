<?php

use App\Models\User;

test('user can register with valid data', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
});

test('registration fails with missing fields', function () {
    $response = $this->postJson('/api/register', []);

    $response->assertStatus(422)
        ->assertJson(['error' => 'validation_failed'])
        ->assertJsonStructure(['details' => ['name', 'email', 'password']]);
});

test('registration fails with duplicate email', function () {
    User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->postJson('/api/register', [
        'name' => 'Another User',
        'email' => 'existing@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJson(['error' => 'registration_failed']);
});

test('user can login with correct credentials', function () {
    User::factory()->create([
        'email' => 'login@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'login@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);
});

test('login fails with wrong password', function () {
    User::factory()->create([
        'email' => 'wrong@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'wrong@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401);
});

test('authenticated user can fetch their profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/user');

    $response->assertStatus(200)
        ->assertJson(['id' => $user->id, 'email' => $user->email]);
});

test('unauthenticated user cannot access protected routes', function () {
    $response = $this->getJson('/api/user');

    $response->assertStatus(401);
});

test('user can update profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patchJson('/api/user/profile', [
        'job_title' => 'Developer',
        'purpose' => 'Building apps',
        'field_of_specialization' => 'technology',
    ]);

    $response->assertStatus(200)
        ->assertJson(['job_title' => 'Developer']);
    expect($user->fresh()->is_onboarded)->toBeTrue();
});

test('user can mark themselves as onboarded', function () {
    $user = User::factory()->create(['is_onboarded' => false]);

    $response = $this->actingAs($user)->patchJson('/api/user/onboarded');

    $response->assertStatus(200);
    expect($user->fresh()->is_onboarded)->toBeTrue();
});

test('user can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('spa')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson(['message' => 'Logged out']);
});
