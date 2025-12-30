import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAKUe5yv0-fMeyMHwXVmUVerGE8nalpJxs",
  authDomain: "decor8-b14e8.firebaseapp.com",
  projectId: "decor8-b14e8",
  storageBucket: "decor8-b14e8.appspot.com",
  messagingSenderId: "301302844702",
  appId: "1:301302844702:web:7376ed27571e8d40cccd0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Registration function
export async function register(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        alert(`Welcome ${name}! A verification email has been sent to ${email}`);
        window.location.href = "products.html";
    } catch (error) {
        console.error("Registration error:", error.message);
        alert("Registration failed: " + error.message);
    }
}

// Login function
export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert(`Welcome back, ${user.email}!`);
        window.location.href = "products.html";

        // Optional: send welcome email using EmailJS
    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
    }
}

// Logout function
export async function logout() {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        console.error('Logout error:', error.message);
    }
}

// Display user info on page
export function displayUserInfo() {
    const userInfoElement = document.getElementById('user-info');
    onAuthStateChanged(auth, (user) => {
        if (user && userInfoElement) {
            userInfoElement.innerHTML = `
                <div style="background: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
                    <span>Welcome, ${user.email}</span>
                    <button onclick="logout()" style="float: right; padding: 5px 10px; background: #ff4444; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        Logout
                    </button>
                </div>
            `;
        }
    });
}

// Make functions globally available
window.register = register;
window.login = login;
window.logout = logout;
window.displayUserInfo = displayUserInfo;


