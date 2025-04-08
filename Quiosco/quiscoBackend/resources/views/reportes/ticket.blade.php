<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ticket Pedido #{{ $pedido->id }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .titulo { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .producto { margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
    </style>
</head>
<body>
    <div class="titulo">Ticket Pedido #{{ $pedido->id }}</div>
    <p><strong>Cliente:</strong> {{ $pedido->user->name }}</p>
    <p><strong>Fecha:</strong> {{ $pedido->created_at->format('d/m/Y H:i') }}</p>
    <p><strong>Total:</strong> ${{ number_format($pedido->total, 2) }}</p>
    <hr>
    <h4>Productos:</h4>
    @foreach($pedido->productos as $producto)
        <div class="producto">
            <p><strong>{{ $producto->nombre }}</strong></p>
            <p>Cantidad: {{ $producto->pivot->cantidad }}</p>
            <p>Precio: ${{ number_format($producto->precio, 2) }}</p>
            @if($producto->pivot->descuento)
                <p>Descuento: ${{ number_format($producto->pivot->descuento, 2) }}</p>
            @endif
        </div>
    @endforeach
</body>
</html>