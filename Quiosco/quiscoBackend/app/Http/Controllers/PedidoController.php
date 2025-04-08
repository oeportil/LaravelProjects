<?php

namespace App\Http\Controllers;

use App\Http\Resources\PedidoCollection;
use App\Models\Pedido;
use App\Models\PedidoProducto;
use App\Models\Producto;
use App\Models\Descuento;
use App\Models\Categoria;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new PedidoCollection(Pedido::With('user')->with('productos')->where('estado', 0)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $pedido = new Pedido();
        $pedido->user_id = Auth::id();
        $pedido->total = 0; 
        $pedido->save();

        $total = 0;

        foreach ($request->productos as $producto) {
            $productoModel = Producto::with('descuentoActivo')->find($producto['id']);
            $precio = $productoModel->precio;
            $descuento = $productoModel->descuentoActivo;

            $descuento_aplicado = $descuento ? ($precio * $descuento->porcentaje / 100) : 0;
            $precio_final = $precio - $descuento_aplicado;

            PedidoProducto::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $producto['id'],
                'cantidad' => $producto['cantidad'],
                'descuento' => $descuento_aplicado,
            ]);

            $total += $precio_final * $producto['cantidad'];
        }

        $pedido->total = $total;
        $pedido->save();

        return ['message' => 'Pedido creado correctamente'];
    }

    /**
     * Display the specified resource.
     */
    public function show(Pedido $pedido)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido $pedido)
    {
        //
        $pedido->estado = 1;
        $pedido->save();

        return [
            'pedido' => $pedido
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido $pedido)
    {
        if ($pedido->estado == 0) {
            $pedido->productos()->detach(); 
            $pedido->delete();
            return response()->json(['message' => 'Pedido eliminado']);
        }
        return response()->json(['message' => 'No se puede eliminar un pedido completado'], 403);
    }

    public function ticket($id)
    {
        $pedido = Pedido::with(['productos', 'user'])->findOrFail($id);

        $pdf = Pdf::loadView('reportes.ticket', compact('pedido'));
        return $pdf->stream("ticket_pedido_{$id}.pdf");
    }
    public function historialCliente($id)
    {
        return Pedido::with('productos')->where('user_id', $id)->get();
    }
    public function topProductos(Request $request)
    {
        $from = Carbon::parse($request->input('desde', Carbon::now()->subDays(7)->startOfDay()))->format('Y-m-d H:i:s');
        $to = Carbon::parse($request->input('hasta', Carbon::now()->endOfDay()))->format('Y-m-d H:i:s');
    
        $result = \DB::select("
            SELECT p.id as producto_id, p.nombre, SUM(pp.cantidad) as total_vendidos
            FROM pedido_productos pp
            JOIN productos p ON pp.producto_id = p.id
            JOIN pedidos pd ON pp.pedido_id = pd.id
            WHERE pd.estado IS TRUE
            AND pd.created_at BETWEEN ? AND ?
            GROUP BY p.id, p.nombre
            ORDER BY total_vendidos DESC
            LIMIT 10
        ", [$from, $to]);
    
        //log de productos, from y to
        \Log::info("Top productos desde: {$from} hasta: {$to}");
        \Log::info($result);
        return response()->json($result);
    }
    
    public function diasPopulares(Request $request)
    {
        $from = Carbon::parse($request->input('desde', Carbon::now()->subDays(7)->startOfDay()))->format('Y-m-d H:i:s');
        $to = Carbon::parse($request->input('hasta', Carbon::now()->endOfDay()))->format('Y-m-d H:i:s');
    
        $result = \DB::select("
            SELECT TO_CHAR(pd.created_at, 'FMDay') as dia, COUNT(*) as total
            FROM pedidos pd
            WHERE pd.estado IS TRUE
            AND pd.created_at BETWEEN ? AND ?
            GROUP BY TO_CHAR(pd.created_at, 'FMDay')
            ORDER BY total DESC
        ", [$from, $to]);
    
        return response()->json($result);
    }
    
    public function horariosPopulares(Request $request)
    {
        $from = Carbon::parse($request->input('desde', Carbon::now()->subDays(7)->startOfDay()))->format('Y-m-d H:i:s');
        $to = Carbon::parse($request->input('hasta', Carbon::now()->endOfDay()))->format('Y-m-d H:i:s');
    
        $result = \DB::select("
            SELECT EXTRACT(HOUR FROM pd.created_at) as hora, COUNT(*) as total
            FROM pedidos pd
            WHERE pd.estado IS TRUE
            AND pd.created_at BETWEEN ? AND ?
            GROUP BY EXTRACT(HOUR FROM pd.created_at)
            ORDER BY total DESC
        ", [$from, $to]);
    
        return response()->json($result);
    }
    
    public function reporteFinanciero(Request $request)
    {
        $from = Carbon::parse($request->input('desde', Carbon::now()->subDays(7)->startOfDay()))->format('Y-m-d H:i:s');
        $to = Carbon::parse($request->input('hasta', Carbon::now()->endOfDay()))->format('Y-m-d H:i:s');
    
        $totalVentas = \DB::selectOne("
            SELECT SUM(pd.total) as total_ventas
            FROM pedidos pd
            WHERE pd.estado IS TRUE
            AND pd.created_at BETWEEN ? AND ?
        ", [$from, $to]);
    
        $ventasDiarias = \DB::select("
            SELECT DATE(pd.created_at) as fecha, SUM(pd.total) as total_diario
            FROM pedidos pd
            WHERE pd.estado IS TRUE
            AND pd.created_at BETWEEN ? AND ?
            GROUP BY DATE(pd.created_at)
            ORDER BY fecha ASC
        ", [$from, $to]);
    
        return response()->json([
            'total_ventas' => $totalVentas->total_ventas ?? 0,
            'ventas_diarias' => $ventasDiarias,
        ]);
    }
    
    public function topCategorias(Request $request)
    {
        $from = Carbon::parse($request->input('desde', Carbon::now()->subDays(7)->startOfDay()))->format('Y-m-d H:i:s');
        $to = Carbon::parse($request->input('hasta', Carbon::now()->endOfDay()))->format('Y-m-d H:i:s');
    
        $result = \DB::select("
            SELECT c.id as categoria_id, c.nombre as categoria_nombre, SUM(pp.cantidad) as total_vendidos
            FROM pedido_productos pp
            JOIN productos p ON pp.producto_id = p.id
            JOIN categorias c ON p.categoria_id = c.id
            JOIN pedidos pd ON pp.pedido_id = pd.id
            WHERE pd.estado IS TRUE
            AND pd.created_at BETWEEN ? AND ?
            GROUP BY c.id, c.nombre
            ORDER BY total_vendidos DESC
            LIMIT 10
        ", [$from, $to]);
    
        return response()->json($result);
    }
    
}
