<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FormFieldController extends Controller
{
    public function index()
    {
        return FormField::all();
    }
}
