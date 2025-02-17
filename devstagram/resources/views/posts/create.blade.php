@extends('layouts.app')

@section('title')
    Crea una nueva Publicación
@endsection

@push('styles')
<link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />
@endpush

@section('content')
    <div class="md:flex md:items-center">
        <div class="md:w-1/2 px-10">
            <form action="{{route('imagenes.store')}}" method="post" enctype="multipart/form-data" id="dropzone" class="dropzone border-dashed border-2 w-full h-96
            rounded flex flex-col justify-center items-center">
            @csrf
            </form>
        </div>
        <div class="md:w-1/2 px-10 bg-white rounded-lg py-6 shadow-xl mt-10 md:mt-0">
        <form method="post" action="{{route('post.store')}}">
                @csrf                
                <div class="mb-5">
                    <label id="titulo" for="titulo" class="mb-2 block uppercase text-gray-500 font-bold">
                        titulo
                    </label>
                    <input type="text" id="titulo" name="titulo" placeholder="Titulo de la Publicación"
                    class="border p-3 w-full rounded-lg"
                    value="{{old('titulo')}}"
                    >
                    @error('titulo')
                        <p class="bg-red-500 text-white my-2 
                        rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                    @enderror
                </div>
                <div class="mb-5">
                    <label id="descripcion" for="descripcion" class="mb-2 block uppercase text-gray-500 font-bold">
                        Descripción
                    </label>
                    <textarea id="descripcion" name="descripcion" placeholder="Descripción de la Publicación"
                    class="border p-3 w-full rounded-lg"
                    >
                    {{old('descripcion')}}
                    </textarea>
                    @error('descripcion')
                        <p class="bg-red-500 text-white my-2 
                        rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                    @enderror
                </div>
                <div class="mb-5">
                    <input type="hidden" name="imagen" value="{{old('imagen')}}">
                </div>
                @error('imagen')
                    <p class="bg-red-500 text-white my-2 
                    rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                @enderror
                <input type="submit" value="Crear Publicación" 
                class="bg-sky-600 hover:bg-sky-700 transition-colors cursor-pointer
                uppercase font-bold w-full p-3 text-white rounded-lg">
            </form>
        </div>
    </div>
@endsection