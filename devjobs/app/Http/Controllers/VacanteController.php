<?php

namespace App\Http\Controllers;

use App\Models\Vacante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class VacanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Vacante::class);
        return view('vacantes.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Vacante::class);
        return view('vacantes.create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Vacante $vacante)
    {
        return view('vacantes.show', [
            'vacante' => $vacante,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vacante $vacante)
    {
        Gate::authorize('update', $vacante);
        return view('vacantes.edit', [
            'vacante' => $vacante,
        ]);
    }
}
