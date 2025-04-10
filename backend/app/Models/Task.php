<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['project_id', 'title', 'description', 'status'];

    protected $casts = [
        'status' => 'string', 
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}