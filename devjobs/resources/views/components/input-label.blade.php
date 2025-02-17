@props(['value'])

<label {{ $attributes->merge(['class' => 'block text-xs text-gray-500 font-bold uppercase mb-2']) }}>
    {{ $value ?? $slot }}
</label>
