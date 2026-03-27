<?php

test('the health endpoint returns success', function () {
    $response = $this->getJson('/api/health');

    $response->assertStatus(200)
             ->assertJsonStructure(['status', 'timestamp']);
});
