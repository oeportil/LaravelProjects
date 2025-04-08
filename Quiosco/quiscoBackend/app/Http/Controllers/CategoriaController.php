<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoriaCollection;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoriaController extends Controller
{
    public function index(){
         $categorias = Categoria::all();
        // return response($categorias);
        return new CategoriaCollection($categorias);
    }
    public function update(Request $request, Categoria $categoria)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'icono' => 'required|string|max:255',
        ]);

        $categoria->update($request->only(['nombre', 'icono']));

        return response()->json(['message' => 'Categoría actualizada correctamente', 'categoria' => $categoria]);
    }
    public function subirIcono(Request $request, Categoria $categoria)
    {
        $request->validate([
            'icono' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $extension = $request->file('icono')->getClientOriginalExtension();
        $nombreIcono = $categoria->icono . '.' . $extension; 
        $ruta = storage_path('app/public/categorias');

        if (!file_exists($ruta)) {
            mkdir($ruta, 0755, true);
        }

        $request->file('icono')->move($ruta, $nombreIcono);


        if (file_exists($ruta . '/' . $nombreIcono)) {
            \Log::info("El archivo se movió correctamente a: {$ruta}/{$nombreIcono}");
        } else {
            \Log::error("El archivo no se movió correctamente a: {$ruta}/{$nombreIcono}");
        }

        return response()->json(['message' => 'Icono actualizado correctamente']);
    }
    
    public function verIcono(Categoria $categoria)
    {
        $nombreIcono = $categoria->icono;
        $rutaBase = storage_path('app/public/categorias/');
        $found = false;
    
        $extensiones = ['jpg', 'jpeg', 'png', 'webp'];
    
        foreach ($extensiones as $extension) {
            $ruta = $rutaBase . $nombreIcono . '.' . $extension;
            if (file_exists($ruta)) {
                $found = true;
                return response()->file($ruta);
            }
        }
        if (!$found) {
            $rutaDefault = storage_path('app/public/categorias/default.png');
            if (file_exists($rutaDefault)) {
                return response()->file($rutaDefault);
            }
        }
        
    
        return response()->json(['error' => 'Icono no encontrado'], 404);
    }
}
