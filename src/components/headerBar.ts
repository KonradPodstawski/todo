export function getHeaderBarHtml() {
    return `
    <div id="header-bar" class="bg-blue-600 text-white p-4 hidden">
        <div class="flex justify-between items-center">
            <div class="text-2xl">Project Management</div>
            <button id="logout-button" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Log Out</button>
        </div>
    </div>
    `;
}
