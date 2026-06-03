<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ApplicationService;

class ApplicationController extends Controller
{
    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Submit a new application.
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'answers' => 'nullable|array',
            'answers.*.field_id' => 'required|exists:form_fields,id',
            'answers.*.value' => 'required|string|max:1000',
            'documents' => 'nullable|array',
            'documents.*.type' => 'required|string|max:50',
            'documents.*.url' => 'required|url|max:1000',
        ]);

        try {
            $application = $this->applicationService->apply($validated, auth()->id());

            return response()->json([
                'message' => 'Lamaran berhasil dikirim',
                'data' => $application
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Get applications for the authenticated user.
     */
    public function myApplications(Request $request)
    {
        $applications = $this->applicationService->getMyApplications($request->user()->id);
        return response()->json($applications);
    }
}

