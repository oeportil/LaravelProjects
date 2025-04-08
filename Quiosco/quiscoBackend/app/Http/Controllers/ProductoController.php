<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductoCollection;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new ProductoCollection(
            Producto::with('descuentoActivo')->where('disponible', 1)->orderBy('id', 'DESC')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'disponible' => 'boolean',
        ]);

        $producto = Producto::create($request->all());

        return response()->json([
            'message' => 'Producto creado correctamente',
            'producto' => $producto
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $producto->disponible = !$producto->disponible;
        $producto->save();
        return [
            'message' => $producto
        ];

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        //
    }
    public function actualizarInfo(Request $request, Producto $producto)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'numeric',
        ]);

        $producto->update($request->only(['nombre', 'descripcion', 'precio']));

        return response()->json([
            'message' => 'Producto actualizado correctamente',
            'producto' => $producto
        ]);
    }

    public function subirImagen(Request $request, Producto $producto)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);
    
        $extension = $request->file('imagen')->getClientOriginalExtension();
        $nombreImagen = $producto->imagen . '.' . $extension; 
        $ruta = storage_path('app/public/productos');
    
        if (!file_exists($ruta)) {
            mkdir($ruta, 0755, true);
        }
    
        $extensiones = ['jpg', 'jpeg', 'png', 'webp'];
        foreach ($extensiones as $ext) {
            $rutaExistente = $ruta . '/' . $producto->imagen . '.' . $ext;
            if (file_exists($rutaExistente)) {
                unlink($rutaExistente);
                \Log::info("Imagen eliminada: {$rutaExistente}");
            }
        }
    
        $request->file('imagen')->move($ruta, $nombreImagen);
    
        if (file_exists($ruta . '/' . $nombreImagen)) {
            \Log::info("El archivo se movió correctamente a: {$ruta}/{$nombreImagen}");
        } else {
            \Log::error("El archivo no se movió correctamente a: {$ruta}/{$nombreImagen}");
        }
    
        return response()->json(['message' => 'Imagen actualizada correctamente']);
    }

    public function verImagen(Producto $producto)
    {
        $nombreImagen = $producto->imagen;
        $rutaBase = storage_path('app/public/productos/');

        $extensiones = ['jpg', 'jpeg', 'png', 'webp'];

        foreach ($extensiones as $extension) {
            $ruta = $rutaBase . $nombreImagen . '.' . $extension;
            if (file_exists($ruta)) {
                return response()->file($ruta);
            }
        }

        $rutaDefault = storage_path('app/public/productos/default.png');
        if (file_exists($rutaDefault)) {
            return response()->file($rutaDefault);
        }

        return response()->json(['error' => 'Imagen no encontrada'], 404);
    }
    public function verAdmin()
    {
        $hoy = Carbon::now()->startOfDay();

        $productos = Producto::with(['descuentoActivo', 'categoria'])
            ->withCount(['pedidoProductos as cantidad_vendida' => function ($query) use ($hoy) {
                $query->whereHas('pedido', function ($q) use ($hoy) {
                    $q->where('estado', 1)->whereDate('created_at', $hoy);
                })->selectRaw('SUM(cantidad)');
            }])
            ->orderByDesc('cantidad_vendida') 
            ->get();

        return new ProductoCollection($productos);
    }
}
