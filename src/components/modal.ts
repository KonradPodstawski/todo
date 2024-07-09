export function getModalHtml() {
    return `
    <div id="modal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden">
        <div class="bg-white p-4 rounded w-full max-w-lg">
            <div id="modal-content"></div>
            <div class="flex justify-end mt-4">
                <button id="modal-close" class="bg-red-500 text-white p-2 rounded">Close</button>
            </div>
        </div>
    </div>
    `;
}

export function setupModal() {
    document.querySelector<HTMLButtonElement>('#modal-close')?.addEventListener('click', () => {
        document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
    });
}

export function showModal(content: string) {
    const modalContent = document.querySelector<HTMLDivElement>('#modal-content');
    if (modalContent) {
        modalContent.innerHTML = content;
        document.querySelector<HTMLDivElement>('#modal')!.classList.remove('hidden');
    }
}
