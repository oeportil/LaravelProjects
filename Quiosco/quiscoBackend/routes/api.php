<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\DescuentoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    

    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    Route::post('/logout', [AuthController::class, 'logout']);

    // Ver productos admin
    Route::get('/productosadmin', [ProductoController::class, 'verAdmin']);

    Route::apiResource('/pedidos', PedidoController::class);
    Route::apiResource('/categorias', CategoriaController::class);
    Route::apiResource('/productos', ProductoController::class);
    Route::apiResource('/descuentos', DescuentoController::class);

    //Listar descuentos por producto
    Route::get('/productosdesc/{producto}', [DescuentoController::class, 'listarPorProducto']);


    Route::put('/productos/{producto}/editar-info', [ProductoController::class, 'actualizarInfo']);


    

    // Productos - imágenes
    Route::post('/productos/{producto}/imagen', [ProductoController::class, 'subirImagen']);
    

    // Categorías - iconos
    Route::post('/categorias/{categoria}/icono', [CategoriaController::class, 'subirIcono']);
    
    
});

Route::prefix('reportes')->group(function () {
    Route::get('/ticket/{id}', [PedidoController::class, 'ticket']);
    Route::get('/historial-cliente/{id}', [PedidoController::class, 'historialCliente']);
    Route::get('/top-productos', [PedidoController::class, 'topProductos']);
    Route::get('/top-categorias', [PedidoController::class, 'topCategorias']);
    Route::get('/dias-populares', [PedidoController::class, 'diasPopulares']);
    Route::get('/horas-populares', [PedidoController::class, 'horariosPopulares']);
    Route::get('/reporte-financiero', [PedidoController::class, 'reporteFinanciero']);
    Route::get('/productos-del-dia', [PedidoController::class, 'productosDelDia']); 
});
//Imagenes y iconos públicos
Route::get('/productos/{producto}/imagen', [ProductoController::class, 'verImagen']);
Route::get('/categorias/{categoria}/icono', [CategoriaController::class, 'verIcono']);
// Autenticación pública
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
