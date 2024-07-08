import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.ts';
import { setupAuth, getAuthHtml } from './components/auth.ts';
import { getTitlePageHtml } from './components/titlePage.ts';
import { getUser } from './utils/auth.ts';

const htmlUser = async (): Promise<string> => {
    const user = await getUser();
    if (!user) return 'no user found';

    return user?.id.toString();
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

<div class="bg-gray-200 min-w-screen min-h-screen">
    ${htmlUser()}
</div>
`;

setupAuth();
