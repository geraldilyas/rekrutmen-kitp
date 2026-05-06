<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormField;
use Illuminate\Http\Request;

class FormFieldController extends Controller
{
    // GET semua field
    public function index()
    {
        return FormField::all();
    }

    // STORE field 
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required',
            'type' => 'required|in:text,textarea,number,date,file,url,select',
            'options' => 'nullable|array',
            'is_required' => 'boolean'
        ]);

        $field = FormField::create([
            'label' => $request->label,
            'type' => $request->type,
            'options' => $request->options,
            'is_required' => $request->is_required ?? false
        ]);

        return response()->json([
            'message' => 'Field berhasil dibuat',
            'data' => $field
        ]);
    }
}