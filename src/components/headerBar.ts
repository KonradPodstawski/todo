import { UserService } from '../services/UserService.ts';

export function getHeaderBarHtml() {
  return `
    <div id="header-bar" class="bg-gray-800 text-white p-4 justify-between items-center hidden dark:bg-gray-900">
        <button id="theme-toggle" class="flex top-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 rounded">
          Toggle Dark Mode
        </button>
        <button id="logout-button" class="bg-red-500 dark:bg-red-700 text-white p-2 rounded">Log Out</button>
    </div>
    <div id="user-list" class="bg-gray-100 dark:bg-gray-800 hidden">
      <div id="users-container" class="text-black dark:text-white"></div>
    </div>
  `;
}

export async function setupHeaderBar() {
  const users = await UserService.getAll();
  const usersContainer = document.querySelector<HTMLDivElement>('#users-container');
  if (usersContainer) {
    usersContainer.innerHTML = users.map(user => `
      <div class="p-2 border-b">
        <p><strong>Name:</strong> ${user.first_name} ${user.last_name} ${user.role === 'admin' ? '🟢' : ''}</p>
        <p><strong>Role:</strong> ${user.role}</p>
      </div>
    `).join('');
  }

  const toggle = document.querySelector<HTMLButtonElement>('#theme-toggle');
  toggle!.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      document.body.style.backgroundColor = "rgb(31 41 55)"
    } else {
      document.body.style.backgroundColor = "white"
    }
  });
}
