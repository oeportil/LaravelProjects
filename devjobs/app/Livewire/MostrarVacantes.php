<?php

namespace App\Livewire;

use App\Models\Vacante;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\On;
use Livewire\Component;

class MostrarVacantes extends Component
{

    #[On('elminar_vacante')]
    public function eliminarVacante(Vacante $id){
        $id->delete();
    }
    public function render()
    {
        $vacantes = Vacante::where('user_id', Auth::user()->id)->paginate(10);

        return view('livewire.mostrar-vacantes', [
            'vacantes' => $vacantes
        ]);
    }
}
