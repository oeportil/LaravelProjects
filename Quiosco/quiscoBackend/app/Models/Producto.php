<?php

namespace App\Models;

use App\Models\Descuento;
use App\Models\Pedido;
use App\Models\Categoria;
use App\Models\PedidoProducto;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion', 'precio', 'imagen', 'disponible', 'categoria_id'];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function descuentos()
    {
        return $this->hasMany(Descuento::class);
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
                    ->withPivot('cantidad', 'descuento')
                    ->withTimestamps();
    }

    public function descuentoActivo()
    {
        return $this->hasOne(Descuento::class)
            ->where('fecha_inicio', '<=', now())
            ->where('fecha_fin', '>=', now());
    }
    public function pedidoProductos()
    {
        return $this->hasMany(PedidoProducto::class, 'producto_id');
    }
}
