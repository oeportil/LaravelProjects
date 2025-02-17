<div class="flex flex-col items-center justify-center mt-10 bg-gray-100">
    <h3 class="my-4 text-2xl font-bold text-center ">Postularme a esta vacante</h3>

    @if(session('mensaje'))
        <p class="p-2 my-5 text-xs font-bold text-green-600 uppercase
        bg-green-100 border border-green-600 rounded-lg">
               {{session('mensaje')}}
        </p>
    @else
        <form action="" class="mt-5 w-96" wire:submit.prevent='postularme'>
            <div class="mb-4">
                <x-input-label for="cv" :value="'Curriculum u Hoja de Vida (PDF)'"/>
                <x-text-input id="cv" class="block w-full mt-1"
                                type="file"
                                wire:model="cv"
                                accept=".pdf"
                            />
            </div>
            @error('cv')
                <livewire:mostrar-alerta :message='$message'>
            @enderror
            <x-primary-button class="my-5">
                {{ __('Postularme') }}
            </x-primary-button>
        </form>
    @endif
</div>
