<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class ApplicationDataScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // Only apply scope for authenticated admin users
        if (Auth::check() && Auth::user()->role === 'admin') {
            $user = Auth::user();

            if ($user->admin_level == 2) {
                // Level 2 sees applications for their own jobs
                $builder->whereHas('job', function ($query) use ($user) {
                    $query->where('created_by', $user->id);
                });
            } elseif ($user->admin_level == 3) {
                // Level 3 sees applications for their parent's jobs
                $builder->whereHas('job', function ($query) use ($user) {
                    $query->where('created_by', $user->parent_id);
                });
            }
            // Level 1 sees everything
        }
    }
}
