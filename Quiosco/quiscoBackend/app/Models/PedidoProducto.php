<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PedidoProducto extends Pivot
{
    protected $table = 'pedido_productos';

    protected $fillable = ['pedido_id', 'producto_id', 'cantidad', 'descuento'];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
}
