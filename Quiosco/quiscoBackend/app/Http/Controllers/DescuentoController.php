<?php

namespace App\Http\Controllers;

use App\Models\Descuento;
use Illuminate\Http\Request;

class DescuentoController extends Controller
{
    public function index()
    {
        return Descuento::with('producto')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'porcentaje' => 'required|numeric|min:1|max:100',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        $conflicto = Descuento::where('producto_id', $request->producto_id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('fecha_inicio', [$request->fecha_inicio, $request->fecha_fin])
                    ->orWhereBetween('fecha_fin', [$request->fecha_inicio, $request->fecha_fin])
                    ->orWhere(function ($query) use ($request) {
                        $query->where('fecha_inicio', '<=', $request->fecha_inicio)
                            ->where('fecha_fin', '>=', $request->fecha_fin);
                    });
            })
            ->exists();

        if ($conflicto) {
            return response()->json(['message' => 'Conflicto de fechas con un descuento existente'], 422);
        }

        $descuento = Descuento::create($request->all());
        return response()->json(['message' => 'Descuento creado correctamente', 'descuento' => $descuento]);
    }

    public function update(Request $request, Descuento $descuento)
    {
        $request->validate([
            'porcentaje' => 'numeric|min:1|max:100',
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date|after_or_equal:fecha_inicio',
        ]);

        $descuento->update($request->all());
        return response()->json(['message' => 'Descuento actualizado correctamente', 'descuento' => $descuento]);
    }
    public function listarPorProducto($producto_id)
    {
        $descuentos = Descuento::where('producto_id', $producto_id)->get();

        if ($descuentos->isEmpty()) {
            return response()->json(['message' => 'No hay descuentos para este producto'], 404);
        }

        return response()->json($descuentos);
    }
}

