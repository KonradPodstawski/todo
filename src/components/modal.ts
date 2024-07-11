export function getModalHtml() {
    return `
      <div id="modal" class="fixed inset-0 items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 hidden">
        <div class="bg-white dark:bg-gray-800 p-4 rounded w-full max-w-lg">
          <div id="modal-content" class="text-black dark:text-white"></div>
        </div>
      </div>
    `;
  }
  
export function setupModal() {
    document.querySelector<HTMLButtonElement>('#modal-close')?.addEventListener('click', () => {
        document.querySelector<HTMLDivElement>('#modal')!.classList.add('hidden');
        document.querySelector<HTMLDivElement>('#modal')!.classList.remove('flex');
    });
}

export function showModal(content: string) {
    const modalContent = document.querySelector<HTMLDivElement>('#modal-content');
    if (modalContent) {
        modalContent.innerHTML = content;
        document.querySelector<HTMLDivElement>('#modal')!.classList.remove('hidden');
        document.querySelector<HTMLDivElement>('#modal')!.classList.add('flex');
    }
}
