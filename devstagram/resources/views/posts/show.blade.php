@extends('layouts.app')

@section('title')
    {{$post->titulo}}
@endsection
    
@section('content')
    <div class="container mx-auto md:flex">
        <div class="md:w-1/2">
            <img src="{{asset('uploads/'.$post->imagen)}}" alt="Imagen del post {{$post->titulo}}" srcset="">
            <div class="p-3 flex items-center gap-4">
                @auth
                    @if ($post->checkedLike(auth()->user()))
                        <form action="{{route('post.likes.destroy', $post)}}" method="post">
                            @method('DELETE')
                            @csrf
                            <div class="my-4">
                                <button type="submit">
                                    <svg fill="red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </button>
                            </div>  
                        </form>
                    @else
                        <form action="{{route('post.likes.store', $post)}}" method="post">
                            @csrf
                            <div class="my-4">
                                <button type="submit">
                                    <svg fill="white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </button>
                            </div>  
                        </form>
                    @endif
                    
                @endauth
                <p>{{$post->likes->count()}} Likes</p>
            </div>
            <div>
                <p class="font-bold">{{$post->user->username}}</p>
                <p class="text-sm text-gray-500">
                    {{$post->created_at->diffForHumans()}}
                </p>
                <p class="mt-5">
                    {{$post->descripcion}}
                </p>
                @auth
                    @if ($post->user_id === auth()->user()->id)
                        <form method="post" action="{{route('post.destroy', $post)}}">
                            @method('DELETE')
                            @csrf
                            <input type="submit" value="Eliminar Publicación"
                            class="bg-red-500 hover:bg-red-600 p-2 rounded text-white font-bold mt-10
                            cursor-pointer">
                        </form>
                    @endif
                @endauth
            </div>
        </div>
        <div class="md:w-1/2 p-5">
            <div class="shadow bg-white p-5 mb-5">
               @auth
                <p class="text-xl font-bold text-center mb-4">Agrega un Nuevo Comentario</p>
                    @if (session('mensaje'))
                        <p class="bg-green-500 text-white my-2 
                        rounded-lg text-sm p-2 text-center">{{ session('mensaje') }}</p>
                    @endif
                    <form action="{{route('comentarios.store', [$user, $post])}}" method="POST">
                        @csrf
                        <div class="mb-5">
                            <label id="comentario" for="comentario" class="mb-2 block uppercase text-gray-500 font-bold">
                                Añade un Comentario
                            </label>
                            <textarea id="comentario" name="comentario" placeholder="Agrega un Comentario"
                            class="border p-3 w-full rounded-lg"
                            >
                            </textarea>
                            @error('comentario')
                                <p class="bg-red-500 text-white my-2 
                                rounded-lg text-sm p-2 text-center">{{ $message }}</p>
                            @enderror
                        </div>
                        <input type="submit" value="Comentar" 
                    class="bg-sky-600 hover:bg-sky-700 transition-colors cursor-pointer
                    uppercase font-bold w-full p-3 text-white rounded-lg">
                    </form>
               @endauth
               <div class="bg-white shadow mb-5 max-h-96 overflow-y-scroll" >
                    @if ($post->comentarios->count())
                        @foreach ( $post->comentarios as $comentario)
                            <div class="p-5 border-gray-300 border-b">
                                <a href="{{route('post.index', $comentario->user->username)}}" class="font-bold">{{$comentario->user->username}}</a>
                                <p class="mt-2">
                                    {{ $comentario->comentario }}
                                </p>
                                <p class="text-sm text-gray-500">
                                    {{ $comentario->created_at->diffForHumans()}}
                                </p>                                
                            </div>
                        @endforeach
                    @else
                        <p class=" p-10 text-center">No hay Comentarios Aún</p>
                    @endif
               </div>
            </div>
        </div>
    </div>
@endsection