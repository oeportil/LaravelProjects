<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->text('descripcion')->nullable()->after('nombre');
        });

        Schema::create('descuentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained()->onDelete('cascade');
            $table->Decimal('porcentaje', 5, 2); 
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->timestamps();
        });

        Schema::table('pedido_productos', function (Blueprint $table) {
            $table->Decimal('descuento', 5, 2)->nullable()->after('cantidad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedido_productos', function (Blueprint $table) {
            $table->dropColumn('descuento');
        });

        Schema::dropIfExists('descuentos');

        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('descripcion');
        });
    }
};
