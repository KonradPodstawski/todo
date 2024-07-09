import { supabase } from '../supabase.ts';
import { ProjectService } from '../services/ProjectService';
import { renderProjects } from './projectDetail';

export function getAuthHtml() {
    return `
    <div id="auth-forms" class="mt-8 overflow-hidden relative w-full h-full">
        <div id="carousel-content" class="flex transition-transform duration-500">
            <div id="signup-form" class="w-full p-4">
                <form class="space-y-4" id="signup-form-element">
                    <input type="email" id="signup-email" placeholder="Email" class="border p-2 rounded w-full"/>
                    <input type="password" id="signup-password" placeholder="Password" class="border p-2 rounded w-full"/>
                    <input type="text" id="signup-first-name" placeholder="First Name" class="border p-2 rounded w-full"/>
                    <input type="text" id="signup-last-name" placeholder="Last Name" class="border p-2 rounded w-full"/>
                    <button type="submit" class="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700">Sign Up</button>
                </form>
            </div>
            <div id="login-form" class="w-full p-4">
                <form class="space-y-4" id="login-form-element">
                    <input type="email" id="login-email" placeholder="Email" class="border p-2 rounded w-full"/>
                    <input type="password" id="login-password" placeholder="Password" class="border p-2 rounded w-full"/>
                    <button type="submit" class="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700">Log In</button>
                </form>
            </div>
        </div>
    </div>
    <div id="auth-controls" class="mt-4">
        <button id="toggle-signup" class="mr-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
        <button id="toggle-login" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">Log In</button>
    </div>
    <div id="auth-message" class="mt-4 text-red-500"></div>
    `;
}

export async function signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ message?: string, error?: string }> {
    const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    const { data, error: dbError } = await supabase
        .from('users')
        .insert([{ id: user.user!.id, first_name: firstName, last_name: lastName }]);

    if (dbError) {
        return { error: dbError.message };
    }

    return { message: 'User registered successfully' };
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
    const projectContent = document.querySelector<HTMLDivElement>('#project-content');

    if (authForms && authControls && headerBar && logoutButton && authMessage && projectContent) {
        if (user) {
            authForms.classList.add('hidden');
            authControls.classList.add('hidden');
            headerBar.classList.remove('hidden');
            authMessage.innerText = `Welcome, ${user.email}`;
            projectContent.classList.remove('hidden');
            renderProjects();
        } else {
            authForms.classList.remove('hidden');
            authControls.classList.remove('hidden');
            headerBar.classList.add('hidden');
            authMessage.innerText = '';
            projectContent.classList.add('hidden');
        }
    }
}

export function setupAuth() {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector<HTMLFormElement>('#signup-form-element')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = (document.querySelector<HTMLInputElement>('#signup-email')!).value;
            const password = (document.querySelector<HTMLInputElement>('#signup-password')!).value;
            const firstName = (document.querySelector<HTMLInputElement>('#signup-first-name')!).value;
            const lastName = (document.querySelector<HTMLInputElement>('#signup-last-name')!).value;
            const { message, error } = await signUp(email, password, firstName, lastName);
            const authMessage = document.querySelector<HTMLDivElement>('#auth-message');
            if (authMessage) {
                if (error) {
                    authMessage.innerText = error;
                } else {
                    authMessage.innerText = message || 'Sign up successful!';
                    await checkAuthStatus();
                }
            }
        });

        document.querySelector<HTMLFormElement>('#login-form-element')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = (document.querySelector<HTMLInputElement>('#login-email')!).value;
            const password = (document.querySelector<HTMLInputElement>('#login-password')!).value;
            const { data, error } = await logIn(email, password);
            const authMessage = document.querySelector<HTMLDivElement>('#auth-message');
            if (authMessage) {
                if (error) {
                    authMessage.innerText = error.message;
                } else {
                    authMessage.innerText = 'Login successful!';
                    await checkAuthStatus();
                }
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
    });
}
