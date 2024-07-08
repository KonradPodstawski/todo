import { supabase } from '../supabase.ts';

export function getAuthHtml() {
    return `
    <div id="auth-forms" class="mt-8 overflow-hidden relative w-full h-full">
        <div id="carousel-content" class="flex transition-transform duration-500">
            <div id="signup-form" class="w-full p-4">
                <form class="space-y-4">
                    <input type="email" id="signup-email" placeholder="Email" class="border p-2 rounded w-full"/>
                    <input type="password" id="signup-password" placeholder="Password" class="border p-2 rounded w-full"/>
                    <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full">Sign Up</button>
                </form>
            </div>
            <div id="login-form" class="w-full p-4">
                <form class="space-y-4">
                    <input type="email" id="login-email" placeholder="Email" class="border p-2 rounded w-full"/>
                    <input type="password" id="login-password" placeholder="Password" class="border p-2 rounded w-full"/>
                    <button type="submit" class="bg-green-600 text-white p-2 rounded w-full">Log In</button>
                </form>
            </div>
        </div>
    </div>
    <div id="auth-controls" class="mt-4">
        <button id="toggle-signup" class="mr-2 bg-blue-500 text-white p-2 rounded">Sign Up</button>
        <button id="toggle-login" class="bg-green-500 text-white p-2 rounded">Log In</button>
    </div>
    <div id="auth-message" class="mt-4 text-red-500"></div>
    `;
}

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
}

export async function logIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function logOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
    } else {
        checkAuthStatus();
    }
}

export async function checkAuthStatus() {
    const user = (await supabase.auth.getUser()).data.user;
    const authMessage = document.querySelector<HTMLDivElement>('#auth-message');
    const authForms = document.querySelector<HTMLDivElement>('#auth-forms');
    const authControls = document.querySelector<HTMLDivElement>('#auth-controls');
    const headerBar = document.querySelector<HTMLDivElement>('#header-bar');
    const logoutButton = document.querySelector<HTMLButtonElement>('#logout-button');

    if (user) {
        authForms!.classList.add('hidden');
        authControls!.classList.add('hidden');
        headerBar!.classList.remove('hidden');
        authMessage!.innerText = `Welcome, ${user.email}`;
    } else {
        authForms!.classList.remove('hidden');
        authControls!.classList.remove('hidden');
        headerBar!.classList.add('hidden');
        authMessage!.innerText = '';
    }
}

export function setupAuth() {
    document.querySelector<HTMLFormElement>('#signup-form form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.querySelector<HTMLInputElement>('#signup-email')!).value;
        const password = (document.querySelector<HTMLInputElement>('#signup-password')!).value;
        const { data, error } = await signUp(email, password);
        const authMessage = document.querySelector<HTMLDivElement>('#auth-message');
        if (error) {
            authMessage!.innerText = error.message;
        } else {
            authMessage!.innerText = 'Sign up successful! Please check your email for confirmation.';
            await checkAuthStatus();
        }
    });

    document.querySelector<HTMLFormElement>('#login-form form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.querySelector<HTMLInputElement>('#login-email')!).value;
        const password = (document.querySelector<HTMLInputElement>('#login-password')!).value;
        const { data, error } = await logIn(email, password);
        const authMessage = document.querySelector<HTMLDivElement>('#auth-message');
        if (error) {
            authMessage!.innerText = error.message;
        } else {
            authMessage!.innerText = 'Login successful!';
            checkAuthStatus();
        }
    });

    document.querySelector<HTMLButtonElement>('#toggle-signup')?.addEventListener('click', () => {
        document.querySelector<HTMLDivElement>('#carousel-content')!.style.transform = 'translateX(0)';
    });

    document.querySelector<HTMLButtonElement>('#toggle-login')?.addEventListener('click', () => {
        document.querySelector<HTMLDivElement>('#carousel-content')!.style.transform = 'translateX(-50%)';
    });

    document.querySelector<HTMLButtonElement>('#logout-button')?.addEventListener('click', async () => {
        await logOut();
    });

    checkAuthStatus();
}
