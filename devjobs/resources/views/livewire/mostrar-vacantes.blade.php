<div>
    <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
    @forelse ($vacantes as $vacante )
            <div class="p-6 bg-white border-b border-gray-200 md:flex md:justify-between md:items-center">
                <div class="leading-10">
                    <a href="{{route('vacantes.show', $vacante)}}" class="text-xl font-bold">
                        {{$vacante->titulo}}
                    </a>
                    <p class="text-sm font-bold text-gray-600">
                        {{$vacante->empresa}}
                    </p>
                    <p class="text-sm text-gray-500">Último dia: {{ $vacante->ultimo_dia->format('d/m/Y') }}</p>
                </div>
                <div class="flex flex-col items-stretch gap-3 mt-5 md:mt-0 md:flex-row">
                    <a href="{{route('candidatos.index', $vacante)}}" class="px-4 py-2 text-xs font-bold text-center text-white uppercase rounded-lg bg-slate-800">
                        {{$vacante->candidatos->count()}}
                        Candidatos
                    </a>
                    <a href="{{route('vacantes.edit', $vacante->id)}}" class="px-4 py-2 text-xs font-bold text-center text-white uppercase bg-blue-800 rounded-lg">
                        Editar
                    </a>
                    <button wire:click="$dispatch('alerta_eliminar', {id: {{$vacante->id}}})" class="px-4 py-2 text-xs font-bold text-center text-white uppercase bg-red-600 rounded-lg">
                        Eliminar
                    </button>
                </div>
            </div>
        @empty
            <p class="p-3 text-sm text-center text-gray-600">No hay Vacantes Para Mostrar</p>
        @endforelse

    </div>

    <div class="mt-10 ">
        {{$vacantes->links()}}
    </div>


</div>

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>

        document.addEventListener('livewire:init', () => {
            Livewire.on('alerta_eliminar', (event) => {
                Swal.fire({
                    title: "¿Eliminar Vacante?",
                    text: "No se pordra recuperar",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, Eliminar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                if (result.isConfirmed) {
                    const {id} = event

                    Livewire.dispatch('elminar_vacante', {id});

                    Swal.fire({
                    title: "Se eliminó la Vacante!",
                    text: "Eliminado Correctamente",
                    icon: "success"
                    });
                }
                });
            });
        });
    </script>
@endpush
