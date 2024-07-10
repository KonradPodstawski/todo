import { UserService, User } from '../services/UserService.ts';

export function getHeaderBarHtml() {
  return `
    <div id="header-bar" class="bg-gray-800 text-white p-4 flex justify-between items-center hidden">
        <div class="text-lg">Welcome</div>
        <button id="logout-button" class="bg-red-500 text-white p-2 rounded">Log Out</button>
    </div>
    <div id="user-list" class="bg-gray-100 hidden">
      <div id="users-container"></div>
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
}
