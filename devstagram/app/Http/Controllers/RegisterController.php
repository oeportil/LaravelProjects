<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function index(){
        return view('auth.register');
    }

    public function store(Request $request) {

        //Modificar Request
        $request->request->add(['username' => Str::slug($request->username)]);
        // Validación de datos
        $request->validate([
            'name' => 'required|string|max:30',
            'username' => 'required|string|max:30|unique:users',
            'email' => 'required|string|email|max:60|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // dd('Creando Usuario');
        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        //Autenticar usuario
        // Auth::attempt([
        //     'username' => $request->username,
        //     'password' => $request->password,
        // ]);

        //Otra forma de autenticar
        Auth::attempt($request->only('email', 'password'));
        
        //redireccionar al usuario
        return redirect()->route('post.index');
    }
}
