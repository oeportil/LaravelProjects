<div class="p-10">
   <div class="mb-5">
        <h3 class="my-3 text-3xl font-bold text-gray-800">
          {{$vacante->titulo}}
        </h3>

        <div class="p-4 my-10 md:grid md:grid-cols-2 bg-gray-50">
            <p class="my-3 text-xs font-bold text-gray-800 uppercase">
               Empresa:
                  <span class="font-normal normal-case">{{$vacante->empresa}}</span>
            </p>

            <p class="my-3 text-xs font-bold text-gray-800 uppercase">
                  Último dia para postularse:
                  <span class="font-normal normal-case">{{$vacante->ultimo_dia->format('d, M, Y')}}</span>
            </p>

            <p class="my-3 text-xs font-bold text-gray-800 uppercase">
                  Categoria:
                  <span class="font-normal normal-case">{{$vacante->categoria->categoria}}</span>
            </p>

            <p class="my-3 text-xs font-bold text-gray-800 uppercase">
                  Salario:
                  <span class="font-normal normal-case">{{$vacante->salario->salario}}</span>
            </p>
        </div>
   </div>

   <div class="gap-4 md:grid md:grid-cols-6">
         <div class="md:col-span-2">
            <img src="{{asset('storage/vacantes/'.$vacante->imagen)}}" alt="{{'Imagen vacante de' . $vacante->titulo}}">
         </div>
         <div class="md:col-span-4">
            <h2 class="mb-5 text-2xl font-bold">Descripción del Puesto</h2>
            <p>{{$vacante->descripcion}}</p>
         </div>
   </div>
      @guest
            <div class="p-5 mt-5 text-center border-dashed border-gray-50">
                  <p>¿Deseas aplicara esta Vacante <a class="font-bold text-indigo-600" href="{{route('register')}}">Obten una cuenta y aplica a esta y a otra vacantes</a></p>
            </div>
      @endguest

    @cannot('create', App\Models\Vacante::class)
        <livewire:postular-vacante  :vacante='$vacante' />
    @endcannot

</div>
