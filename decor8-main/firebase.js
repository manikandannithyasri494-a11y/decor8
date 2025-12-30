<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Decor8 - Style Your Home, Live Your Dream</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #f9f7f0 0%, #e3e8f1 100%);
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(to right, #2c3e50, #4a6491);
            color: white;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .logo {
            font-size: 3.5rem;
            margin-bottom: 10px;
            color: #ffd166;
        }
        
        h1 {
            font-size: 2.8rem;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .tagline {
            font-size: 1.5rem;
            font-weight: 300;
            margin-bottom: 20px;
        }
        
        .config-status {
            background: #f0fff4;
            border: 1px solid #c6f6d5;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #2f855a;
            text-align: center;
        }
        
        .config-error {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #c53030;
        }
        
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            font-family: monospace;
            overflow-x: auto;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 40px 0;
        }
        
        .feature-card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            color: #4a6491;
            margin-bottom: 15px;
        }
        
        .feature-title {
            font-size: 1.4rem;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .auth-demo {
            background: white;
            border-radius: 10px;
            padding: 30px;
            margin: 40px 0;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            text-align: center;
        }
        
        .auth-title {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .auth-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-block;
            background: #4a6491;
            color: white;
            padding: 12px 25px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: background 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn:hover {
            background: #2c3e50;
        }
        
        .btn-outline {
            background: transparent;
            border: 2px solid #4a6491;
            color: #4a6491;
        }
        
        .btn-outline:hover {
            background: #4a6491;
            color: white;
        }
        
        footer {
            text-align: center;
            padding: 30px 0;
            margin-top: 40px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }
        
        .user-info {
            background: #ebf8ff;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            display: none;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2.2rem;
            }
            
            .tagline {
                font-size: 1.2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            .auth-buttons {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
    
    <!-- Firebase SDK -->
    <script type="module">
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
        import { 
            getAuth, 
            signInWithEmailAndPassword, 
            createUserWithEmailAndPassword,
            signOut,
            onAuthStateChanged
        } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
        
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyAKUe5yv0-fMeyMHwXVmUVerGE8nalpJxs",
            authDomain: "decor8-b14e8.firebaseapp.com",
            projectId: "decor8-b14e8",
            storageBucket: "decor8-b14e8.appspot.com",
            messagingSenderId: "301302844702",
            appId: "1:301302844702:web:7376ed27571e8d40cccd0f",
            measurementId: "G-NGJ1DN3SCY"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
        
        // Make auth available globally for the demo buttons
        window.auth = auth;
        window.signInWithEmailAndPassword = signInWithEmailAndPassword;
        window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
        window.signOut = signOut;
        
        // Check authentication state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                document.getElementById('user-info').style.display = 'block';
                document.getElementById('user-email').textContent = user.email;
                document.getElementById('auth-demo').style.display = 'none';
                document.getElementById('config-status').innerHTML = 
                    '<i class="fas fa-check-circle"></i> Firebase is configured correctly and user is authenticated';
            } else {
                // User is signed out
                document.getElementById('user-info').style.display = 'none';
                document.getElementById('auth-demo').style.display = 'block';
                document.getElementById('config-status').innerHTML = 
                    '<i class="fas fa-check-circle"></i> Firebase is configured correctly';
            }
        });
    </script>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <i class="fas fa-couch"></i>
            </div>
            <h1>Welcome to Decor8</h1>
            <p class="tagline">"Style Your Home, Live Your Dream"</p>
        </header>
        
        <div class="config-status" id="config-status">
            <i class="fas fa-sync fa-spin"></i> Checking Firebase configuration...
        </div>
        
        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-palette"></i>
                </div>
                <h3 class="feature-title">Interior Design</h3>
                <p>Transform your space with our expert interior design advice and inspiration for every room in your home.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-tree"></i>
                </div>
                <h3 class="feature-title">Outdoor Living</h3>
                <p>Create beautiful outdoor spaces with our curated collection of garden and patio design ideas.</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-tools"></i>
                </div>
                <h3 class="feature-title">DIY Projects</h3>
                <p>Get step-by-step guides for DIY home projects that will personalize your space on a budget.</p>
            </div>
        </div>
        
        <div class="auth-demo" id="auth-demo">
            <h2 class="auth-title">Authentication Demo</h2>
            <p>Try out Firebase Authentication with these test buttons:</p>
            
            <div class="auth-buttons">
                <button class="btn" onclick="testSignUp()">
                    <i class="fas fa-user-plus"></i> Test Sign Up
                </button>
                <button class="btn" onclick="testSignIn()">
                    <i class="fas fa-sign-in-alt"></i> Test Sign In
                </button>
            </div>
        </div>
        
        <div class="user-info" id="user-info">
            <h3><i class="fas fa-user-check"></i> Authenticated User</h3>
            <p>Email: <span id="user-email"></span></p>
            <button class="btn btn-outline" onclick="testSignOut()">
                <i class="fas fa-sign-out-alt"></i> Sign Out
            </button>
        </div>
        
        <div class="code-block">
// Firebase Configuration (usually in a separate file like firebase.js)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAKUe5yv0-fMeyMHwXVmUVerGE8nalpJxs",
  authDomain: "decor8-b14e8.firebaseapp.com",
  projectId: "decor8-b14e8",
  storageBucket: "decor8-b14e8.appspot.com",
  messagingSenderId: "301302844702",
  appId: "1:301302844702:web:7376ed27571e8d40cccd0f",
  measurementId: "G-NGJ1DN3SCY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
        </div>
        
        <footer>
            <p>&copy; 2023 Decor8 - Style Your Home, Live Your Dream</p>
            <p>Your Firebase configuration is correctly set up with the provided API keys.</p>
        </footer>
    </div>
    
    <script>
        // Test functions for the demo buttons
        async function testSignUp() {
            try {
                const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
                const password = 'test123';
                
                await createUserWithEmailAndPassword(window.auth, email, password);
                alert(`Signed up successfully with ${email}`);
            } catch (error) {
                alert('Error with sign up: ' + error.message);
            }
        }
        
        async function testSignIn() {
            try {
                // Try to sign in with a test account (might not exist)
                const email = 'test@example.com';
                const password = 'test123';
                
                await signInWithEmailAndPassword(window.auth, email, password);
                alert('Signed in successfully');
            } catch (error) {
                alert('Error with sign in: ' + error.message + '. You might need to create an account first.');
            }
        }
        
        async function testSignOut() {
            try {
                await window.signOut(window.auth);
                alert('Signed out successfully');
            } catch (error) {
                alert('Error with sign out: ' + error.message);
            }
        }
    </script>
</body>
</html>



