<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\FormFieldService;
use App\Models\FormField;

class FormFieldController extends Controller
{
    protected $formFieldService;

    public function __construct(FormFieldService $formFieldService)
    {
        $this->formFieldService = $formFieldService;
    }

    /**
     * Get all fields.
     */
    public function index()
    {
        return response()->json($this->formFieldService->getAllFields());
    }

    /**
     * Store field.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:text,textarea,number,date,file,url,select',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'category' => 'required|in:data_diri,berkas,tahapan'
        ]);

        $field = $this->formFieldService->createField($validated);

        return response()->json([
            'message' => 'Field berhasil dibuat',
            'data' => $field
        ]);
    }

    /**
     * Delete field.
     */
    public function destroy($id)
    {
        $field = FormField::findOrFail($id);
        $this->formFieldService->deleteField($field);

        return response()->json(['message' => 'Field berhasil dihapus']);
    }
}