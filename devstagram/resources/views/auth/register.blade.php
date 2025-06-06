@extends('layouts.app')

@section('title')
    Regístrate en DevStagram
@endsection

@section('content')
    <div class="md:flex md:justify-center md:gap-10 md:items-center">
        <div class="md:w-6/12 p-5">
            <img src="{{ asset('img/registrar.jpg') }}" alt="Imagen registro de usuarios">
        </div>
        <div class="md:w-4/12 bg-white p-6 rounded-lg shadow-xl">
            <form action="{{route('register')}}" method="post">
                @csrf
                <div class="mb-5">
                    <label id="name" for="" class="mb-2 block uppercase text-gray-500 font-bold">
                        Nombre
                    </label>
                    <input type="text" id="name" name="name" placeholder="tu nombre"
                    class="border p-3 w-full rounded-lg @error('name')
                    border-red-500                        
                    @enderror"
                    value="{{old('name')}}"
                    >
                    @error('name')
                        <p class="bg-red-500 text-white my-2 
                        rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                    @enderror
                </div>
                <div class="mb-5">
                    <label id="username" for="username" class="mb-2 block uppercase text-gray-500 font-bold">
                        Username
                    </label>
                    <input type="text" id="username" name="username" placeholder="tu nombre de Usuario"
                    class="border p-3 w-full rounded-lg"
                    value="{{old('username')}}"
                    >
                    @error('username')
                        <p class="bg-red-500 text-white my-2 
                        rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                    @enderror
                </div>
                <div class="mb-5">
                    <label id="email" for="email" class="mb-2 block uppercase text-gray-500 font-bold">
                        Email
                    </label>
                    <input type="text" id="email" name="email" placeholder="Tu Email"
                    class="border p-3 w-full rounded-lg"
                    value="{{old('email')}}"
                    >
                    @error('email')
                        <p class="bg-red-500 text-white my-2 
                        rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                    @enderror
                </div>
                <div class="mb-5">
                    <label id="Password" for="Password" class="mb-2 block uppercase text-gray-500 font-bold">
                        Password
                    </label>
                    <input type="password" id="Password" name="password" placeholder="Tu Password"
                    class="border p-3 w-full rounded-lg">
                    @error('password')
                        <p class="bg-red-500 text-white my-2 
                        rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                    @enderror
                </div>
                <div class="mb-5">
                    <label id="password_confirmation" for="password_confirmation" class="mb-2 block uppercase text-gray-500 font-bold">
                        Repetir Password
                    </label>
                    <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Repetir Password"
                    class="border p-3 w-full rounded-lg">
                </div>
                <input type="submit" value="Crear Cuenta" 
                class="bg-sky-600 hover:bg-sky-700 transition-colors cursor-pointer
                uppercase font-bold w-full p-3 text-white rounded-lg">
            </form>
        </div>  
    </div>
@endsection