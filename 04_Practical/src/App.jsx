import { useEffect, useState } from 'react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emptyLogin = { email: '', password: '' };
const emptyRegister = { name: '', email: '', password: '', confirmPassword: '' };

export default function App() {
  const [view, setView] = useState('login');
  const [login, setLogin] = useState(emptyLogin);
  const [register, setRegister] = useState(emptyRegister);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLogin((current) => ({ ...current, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
  const changeLogin = (event) => setLogin({ ...login, [event.target.name]: event.target.value });
  const changeRegister = (event) => setRegister({ ...register, [event.target.name]: event.target.value });

  function openView(nextView) {
    setView(nextView);
    setLoginErrors({});
    setRegisterErrors({});
    setMessage('');
  }

  function handleRegister(event) {
    event.preventDefault();
    const errors = {};
    if (!register.name.trim()) errors.name = 'Full name is required';
    else if (register.name.trim().length < 3) errors.name = 'Full name must contain at least 3 characters';
    if (!register.email.trim()) errors.email = 'Email is required';
    else if (!emailPattern.test(register.email)) errors.email = 'Enter a valid email address';
    if (!register.password) errors.password = 'Password is required';
    else if (register.password.length < 6) errors.password = 'Password must contain at least 6 characters';
    if (!register.confirmPassword) errors.confirmPassword = 'Confirm password is required';
    else if (register.password !== register.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    const users = getUsers();
    if (!errors.email && users.some((user) => user.email.toLowerCase() === register.email.toLowerCase())) {
      errors.email = 'An account with this email already exists';
    }
    setRegisterErrors(errors);
    if (Object.keys(errors).length) return;

    // College demo only: never store plain-text passwords in localStorage in a real application.
    users.push({ name: register.name.trim(), email: register.email.trim(), password: register.password });
    localStorage.setItem('users', JSON.stringify(users));
    setRegister(emptyRegister);
    setShowRegisterPassword(false);
    setView('login');
    setMessage('Registration Successful! Please login.');
  }

  function handleLogin(event) {
    event.preventDefault();
    const errors = {};
    if (!login.email.trim()) errors.email = 'Email is required';
    else if (!emailPattern.test(login.email)) errors.email = 'Enter a valid email address';
    if (!login.password) errors.password = 'Password is required';
    setLoginErrors(errors);
    setMessage('');
    if (Object.keys(errors).length) return;

    const user = getUsers().find(
      (item) => item.email.toLowerCase() === login.email.toLowerCase() && item.password === login.password
    );
    if (!user) {
      setMessage('Invalid email or password');
      return;
    }
    if (rememberMe) localStorage.setItem('rememberedEmail', user.email);
    else localStorage.removeItem('rememberedEmail');
    setLoggedInUser(user);
    setView('welcome');
    setMessage('');
  }

  function resetLogin() {
    localStorage.removeItem('rememberedEmail');
    setLogin(emptyLogin);
    setRememberMe(false);
    setShowLoginPassword(false);
    setLoginErrors({});
    setMessage('');
  }

  function resetRegister() {
    setRegister(emptyRegister);
    setShowRegisterPassword(false);
    setRegisterErrors({});
    setMessage('');
  }

  function logout() {
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    setLogin({ email: rememberedEmail, password: '' });
    setRememberMe(Boolean(rememberedEmail));
    setLoggedInUser(null);
    setShowLoginPassword(false);
    setLoginErrors({});
    setView('login');
  }

  const ErrorText = ({ text }) => (text ? <small className="error">{text}</small> : null);

  return (
    <main className="page">
      <section className="card">
        {view === 'login' && (
          <form onSubmit={handleLogin} noValidate>
            <h1>Login</h1>
            <p className="subtitle">Sign in to continue</p>
            {message && <p className={message.startsWith('Registration') ? 'success notice' : 'error notice'}>{message}</p>}
            <label htmlFor="loginEmail">Email</label>
            <input id="loginEmail" name="email" type="email" value={login.email} onChange={changeLogin} placeholder="name@example.com" />
            <ErrorText text={loginErrors.email} />
            <label htmlFor="loginPassword">Password</label>
            <input id="loginPassword" name="password" type={showLoginPassword ? 'text' : 'password'} value={login.password} onChange={changeLogin} placeholder="Enter your password" />
            <ErrorText text={loginErrors.password} />
            <div className="options">
              <label className="check"><input type="checkbox" checked={showLoginPassword} onChange={(event) => setShowLoginPassword(event.target.checked)} /> Show Password</label>
              <label className="check"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Remember Me</label>
            </div>
            <div className="buttons">
              <button type="submit">Login</button>
              <button type="button" className="reset" onClick={resetLogin}>Reset</button>
            </div>
            <p className="switch">New User? <button type="button" className="link" onClick={() => openView('register')}>Create Account</button></p>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} noValidate>
            <h1>Create Account</h1>
            <p className="subtitle">Register as a new user</p>
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={register.name} onChange={changeRegister} placeholder="Your full name" />
            <ErrorText text={registerErrors.name} />
            <label htmlFor="registerEmail">Email</label>
            <input id="registerEmail" name="email" type="email" value={register.email} onChange={changeRegister} placeholder="name@example.com" />
            <ErrorText text={registerErrors.email} />
            <label htmlFor="registerPassword">Password</label>
            <input id="registerPassword" name="password" type={showRegisterPassword ? 'text' : 'password'} value={register.password} onChange={changeRegister} placeholder="At least 6 characters" />
            <ErrorText text={registerErrors.password} />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type={showRegisterPassword ? 'text' : 'password'} value={register.confirmPassword} onChange={changeRegister} placeholder="Enter password again" />
            <ErrorText text={registerErrors.confirmPassword} />
            <label className="check single"><input type="checkbox" checked={showRegisterPassword} onChange={(event) => setShowRegisterPassword(event.target.checked)} /> Show Password</label>
            <div className="buttons">
              <button type="submit">Register</button>
              <button type="button" className="reset" onClick={resetRegister}>Reset</button>
            </div>
            <p className="switch">Already have an account? <button type="button" className="link" onClick={() => openView('login')}>Login</button></p>
          </form>
        )}

        {view === 'welcome' && loggedInUser && (
          <div className="welcome">
            <div className="tick">✓</div>
            <h1>Login Successful!</h1>
            <h2>Welcome, {loggedInUser.name}</h2>
            <p>{loggedInUser.email}</p>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        )}
      </section>
    </main>
  );
}
