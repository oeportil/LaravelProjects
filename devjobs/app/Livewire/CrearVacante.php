<?php

namespace App\Livewire;

use App\Models\Categoria;
use App\Models\Salario;
use App\Models\Vacante;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\WithFileUploads;

class CrearVacante extends Component
{

    public $titulo;
    public $salario;
    public $categoria;
    public $empresa;
    public $ultimo_dia;
    public $descripcion;
    public $imagen;

    use WithFileUploads;

    protected $rules = [
        'titulo' => 'required|string',
        'salario' => 'required|exists:salarios,id',
        'categoria' => 'required|exists:categorias,id',
        'empresa' => 'required|string',
        'ultimo_dia' => 'required|date',
        'descripcion' => 'required|string',
        'imagen' => 'required|image|max:1024'
    ];
    public function render()
    {
        //Consultar DB
        $salarios = Salario::all();
        $categorias = Categoria::all();
        return view('livewire.crear-vacante', [
            'salarios' => $salarios,
            'categorias' => $categorias,
        ]);
    }

    public function crearVacante(){
        $datos = $this->validate();
        //Almacenar la imagen
        $image = $this->imagen->store('vacantes', 'public');
        $nombre_imagen = str_replace('vacantes/', '', $image);
        //Crear la Vacante
        Vacante::create([
            'titulo' => $datos['titulo'],
            'salario_id' => $datos['salario'],
            'categoria_id' => $datos['categoria'],
            'empresa' => $datos['empresa'],
            'ultimo_dia' => $datos['ultimo_dia'],
            'descripcion' => $datos['descripcion'],
            'imagen' => $nombre_imagen, 
            'user_id' => Auth::user()->id
        ]);
        //Crear un mensaje
        session()->flash('mensaje', 'La vacante se publico Correctamente');
        //Redireccionar al usuario
        return redirect()->route('vacantes.index');
    }
}
