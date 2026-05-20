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
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:text,textarea,number,date,file,url,select',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'category' => 'required|in:data_diri,berkas,tahapan'
        ]);

        $field = FormField::create([
            'label' => strip_tags($validated['label']),
            'type' => $validated['type'],
            'options' => $validated['options'],
            'is_required' => $validated['is_required'] ?? false,
            'category' => $validated['category']
        ]);

        return response()->json([
            'message' => 'Field berhasil dibuat',
            'data' => $field
        ]);
    }
}