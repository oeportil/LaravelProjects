<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoriaCollection;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(){
         $categorias = Categoria::all();
        // return response($categorias);
        return new CategoriaCollection($categorias);
    }
}
