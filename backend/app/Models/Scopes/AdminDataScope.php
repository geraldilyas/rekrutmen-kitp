<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class AdminDataScope implements Scope
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
                // Level 2 sees only their own data
                $builder->where($model->getTable() . '.created_by', $user->id);
            } elseif ($user->admin_level == 3) {
                // Level 3 sees data from their parent (Level 2 admin)
                $builder->where($model->getTable() . '.created_by', $user->parent_id);
            }
            // Level 1 sees everything (no filter applied)
        }
    }
}
