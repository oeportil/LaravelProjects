<?php

namespace App\Livewire;

use App\Models\Categoria;
use App\Models\Salario;
use App\Models\Vacante;
use Illuminate\Support\Carbon;
use Livewire\Component;
use Livewire\WithFileUploads;

class EditarVacante extends Component
{
    public $vacante_id;
    public $titulo;
    public $salario;
    public $categoria;
    public $empresa;
    public $ultimo_dia;
    public $descripcion;
    public $imagen;
    public $imagen_nueva;

    use WithFileUploads;

    protected $rules = [
        'titulo' => 'required|string',
        'salario' => 'required|exists:salarios,id',
        'categoria' => 'required|exists:categorias,id',
        'empresa' => 'required|string',
        'ultimo_dia' => 'required|date',
        'descripcion' => 'required|string',
        'imagen_nueva' => 'nullable|image|max:1024'
    ];
    
    public function mount(Vacante $vacante){
        $this->vacante_id = $vacante->id; 
        $this->titulo = $vacante->titulo;
        $this->salario = $vacante->salario_id;
        $this->categoria = $vacante->categoria_id;
        $this->empresa = $vacante->empresa;
        $this->ultimo_dia = Carbon::parse($vacante->ultimo_dia)->format('Y-m-d');
        $this->descripcion = $vacante->descripcion;
        $this->imagen = $vacante->imagen;
    }


    public function EditarVacante(){
        $datos = $this->validate();
        
        if($this->imagen_nueva){
            $image = $this->imagen_nueva->store('vacantes', 'public');
            $datos['imagen'] = str_replace('vacantes/', '', $image);
        }  

        $vacante = Vacante::find($this->vacante_id);

        $vacante->update(
            [
                'titulo' => $datos['titulo'],
               'salario_id' => $datos['salario'],
                'categoria_id' => $datos['categoria'],
                'empresa' => $datos['empresa'],
                'ultimo_dia' => $datos['ultimo_dia'],
                'descripcion' => $datos['descripcion'],
                'imagen' => $datos['imagen'] ?? $vacante->imagen
            ]
        );
        session()->flash('mensaje', 'La Vacante se edito Correctamente');

        return redirect()->route('vacantes.index');
    }



    public function render()
    {

        $salarios = Salario::all();
        $categorias = Categoria::all();
        return view('livewire.editar-vacante', [
            'categorias' => $categorias,
           'salarios' => $salarios,
        ]);
    }
}
