import { getAuthHtml } from './auth.ts';

export function getTitlePageHtml() {
    return `
    <div class="bg-gray-200 flex items-center justify-center min-h-screen" id="title-page">
        <div class="text-center relative w-full max-w-md">
            <h1 class="text-4xl font-bold text-blue-600">Hello, World!</h1>
            <p class="text-lg text-gray-700 mt-4">This is a <a class="underline decoration-indigo-500">Tailwind</a> CSS example.</p>
            ${getAuthHtml()}
        </div>
    </div>
    `;
}
