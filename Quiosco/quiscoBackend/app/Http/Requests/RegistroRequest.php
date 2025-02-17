<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password as PasswordRules;

class RegistroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', PasswordRules::min(8)->letters()->symbols()->numbers()],
        ];
    }

    public function messages(): array
    {
        return [
            'name' => 'El Nombre es Obligatorio',
            'email' => 'El Email es Obligatorio',
            'email.email' => 'El Email no es Valido',
            'email.unique' => 'El Usuario ya esta registrado',
            'password' => 'El Password debe contener al menos 8 caracteres, un simbolo y un número'
        ];
    }
}
