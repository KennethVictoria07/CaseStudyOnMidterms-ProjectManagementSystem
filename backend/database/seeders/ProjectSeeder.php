<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        // Find the admin user
        $admin = User::where('email', 'admin@example.com')->first();
        if (!$admin) {
            throw new \Exception('Admin user not found. Please run UserSeeder first.');
        }

        // Find the regular user
        $user = User::where('email', 'user@example.com')->first();
        if (!$user) {
            throw new \Exception('Regular user not found. Please run UserSeeder first.');
        }

        // Create a project for the admin user
        $adminProject1 = Project::create([
            'title' => 'Website Redesign',
            'description' => 'Redesign the company website to improve user experience.',
            'user_id' => $admin->id,
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create tasks for the admin's project
        Task::create([
            'project_id' => $adminProject1->id,
            'title' => 'Design Homepage',
            'description' => 'Create a new design for the homepage.',
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Task::create([
            'project_id' => $adminProject1->id,
            'title' => 'Implement Navigation',
            'description' => 'Add a responsive navigation bar.',
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create another project for the admin user
        $adminProject2 = Project::create([
            'title' => 'Mobile App Development',
            'description' => 'Develop a mobile app for the company.',
            'user_id' => $admin->id,
            'status' => 'in_progress',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a task for the admin's second project
        Task::create([
            'project_id' => $adminProject2->id,
            'title' => 'Set Up API',
            'description' => 'Create API endpoints for the mobile app.',
            'status' => 'completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create a project for the regular user
        $userProject = Project::create([
            'title' => 'Blog Content Update',
            'description' => 'Update the company blog with new articles.',
            'user_id' => $user->id,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create tasks for the regular user's project
        Task::create([
            'project_id' => $userProject->id,
            'title' => 'Write Article 1',
            'description' => 'Write an article about company updates.',
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Task::create([
            'project_id' => $userProject->id,
            'title' => 'Write Article 2',
            'description' => 'Write an article about industry trends.',
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}