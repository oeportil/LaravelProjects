<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Descuento extends Model
{
    use HasFactory;

    protected $fillable = ['producto_id', 'porcentaje', 'fecha_inicio', 'fecha_fin'];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
