<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold leading-tight text-gray-800">
            {{ __('Notificaciones') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1 class="my-10 text-3xl font-bold text-center">Mis Notificaciones</h1>

                        @forelse ( $notificaciones as  $notificacion)
                            <div class="p-5 border border-gray-200 lg:flex lg:items-center lg:justify-between">
                               <div >
                                    <p class="">
                                        Tienes un nuevo candidato en:
                                        <span>{{$notificacion->data['nombre_vacante']}}</span>
                                    </p>

                                    <p>
                                        <span class="font-bold">{{ $notificacion->created_at->diffForHumans() }}</span>
                                    </p>
                               </div>
                               <div class="mt-5 lg:mt-0">
                                    <a href="" class="p-3 text-sm font-bold text-white uppercase bg-indigo-500 rounded-lg">
                                        Ver Candidatos
                                    </a>
                               </div>
                            </div>
                        @empty
                            <p class="text-center text-gray-600">No Hay Notificaciones Nuevas</p>
                        @endforelse
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
