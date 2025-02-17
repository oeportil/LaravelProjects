<?php

namespace App\Livewire;

use App\Models\Vacante;
use App\Notifications\NuevoCandidato;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use Livewire\WithFileUploads;

class PostularVacante extends Component
{
    public $cv;
    public $vacante;

    use WithFileUploads;

    protected $rules = [
        'cv' => 'required|mimes:pdf'
    ];

    public function mount(Vacante $vacante){
        $this->vacante = $vacante;
    }


    public function postularme(){

       $datos = $this->validate();
        //Almacenar cv en disco duro
       $cv = $this->cv->store('cv', 'public');
       $nombre_cv = str_replace('cv/', '', $cv);
       //Crear Vacante
        $this->vacante->candidatos()->create([
            'user_id' => Auth::user()->id,
            'cv' => $nombre_cv,
        ]);
       //Notificacion
        $this->vacante->reclutador->notify(new NuevoCandidato(
            $this->vacante->id,
            $this->vacante->titulo,
            Auth::user()->id,
        ));


       //mostrar usuario
       session()->flash('mensaje', 'Se envió correctamente tu información, mucha suerte');

       return redirect()->back();
    }
    public function render()
    {
        return view('livewire.postular-vacante');
    }
}
