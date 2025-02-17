<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComentarioController extends Controller
{
    public function store(Request $request, User $user, Post $post){
        $request->validate([
            'comentario' => ['required','max:255']
        ]);

        $comentario = new Comentario();
        $comentario->comentario = $request->comentario;
        $comentario->post_id = $post->id;
        $comentario->user_id = Auth::user()->id;
        $comentario->save();

        return back()->with('mensaje', 'Comentario Creado Correctamente');
    }
}
