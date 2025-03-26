<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::apiResource('/pedidos', PedidoController::class)->middleware('auth:sanctum');


Route::apiResource('/categorias', CategoriaController::class)->middleware('auth:sanctum');
Route::apiResource('/productos', ProductoController::class)->middleware('auth:sanctum');

//Autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
