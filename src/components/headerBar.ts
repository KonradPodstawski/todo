export function getHeaderBarHtml() {
    return `
    <div id="header-bar" class="bg-gray-800 text-white p-4 flex justify-between items-center hidden">
        <div class="text-lg">Welcome</div>
        <button id="logout-button" class="bg-red-500 text-white p-2 rounded">Log Out</button>
    </div>
    `;
}
