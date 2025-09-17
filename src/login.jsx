// login.jsx
import React, { useState } from "react";
import "./login.css";

export default function Login() {
  const [mode, setMode] = useState("signin");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signinErrors, setSigninErrors] = useState({});

  const [signup, setSignup] = useState({ name: "", email: "", password: "", confirm: "" });
  const [signupErrors, setSignupErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation for sign in
  function validateSignin() {
    const errs = {};
    if (!signin.email) errs.email = "Email is required";
    else if (!emailRegex.test(signin.email)) errs.email = "Enter a valid email";
    if (!signin.password) errs.password = "Password is required";
    return errs;
  }

  // Validation for sign up
  function validateSignup() {
    const errs = {};
    if (!signup.name) errs.name = "Name is required";
    if (!signup.email) errs.email = "Email is required";
    else if (!emailRegex.test(signup.email)) errs.email = "Enter a valid email";
    if (!signup.password) errs.password = "Password is required";
    else if (signup.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (signup.password !== signup.confirm) errs.confirm = "Passwords do not match";
    return errs;
  }

  // Fake API (demo only)
  function fakeApiCall(data, isSignup = false) {
    setLoading(true);
    setMessage(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        if (isSignup && data.email.endsWith("@taken.com")) {
          reject({ message: "Email already taken" });
        } else if (!isSignup && data.password !== "password123") {
          reject({ message: "Invalid credentials" });
        } else {
          resolve({ user: { email: data.email, name: data.name || "Demo User" } });
        }
      }, 800);
    });
  }

  async function handleSignin(e) {
    e.preventDefault();
    const errs = validateSignin();
    setSigninErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const res = await fakeApiCall(signin, false);
      setMessage({ type: "success", text: `Welcome back, ${res.user.email}` });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const errs = validateSignup();
    setSignupErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const res = await fakeApiCall(signup, true);
      setMessage({ type: "success", text: `Account created for ${res.user.email}` });
      setMode("signin");
      setSignup({ name: "", email: "", password: "", confirm: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{mode === "signin" ? "Sign In" : "Sign Up"}</h2>

        <div className="switcher">
          <button onClick={() => setMode("signin")} className={mode === "signin" ? "active" : ""}>Sign In</button>
          <button onClick={() => setMode("signup")} className={mode === "signup" ? "active" : ""}>Sign Up</button>
        </div>

        {message && <div className={`alert ${message.type}`}>{message.text}</div>}

        {mode === "signin" ? (
          <form onSubmit={handleSignin}>
            <label>Email</label>
            <input type="email" value={signin.email} onChange={(e) => setSignin({ ...signin, email: e.target.value })} />
            {signinErrors.email && <p className="error">{signinErrors.email}</p>}

            <label>Password</label>
            <input type={showPassword ? "text" : "password"} value={signin.password} onChange={(e) => setSignin({ ...signin, password: e.target.value })} />
            {signinErrors.password && <p className="error">{signinErrors.password}</p>}

            <label className="checkbox">
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword((s) => !s)} /> Show Password
            </label>

            <button type="submit" disabled={loading} className="submit">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <label>Name</label>
            <input type="text" value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} />
            {signupErrors.name && <p className="error">{signupErrors.name}</p>}

            <label>Email</label>
            <input type="email" value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} />
            {signupErrors.email && <p className="error">{signupErrors.email}</p>}

            <label>Password</label>
            <input type={showPassword ? "text" : "password"} value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} />
            {signupErrors.password && <p className="error">{signupErrors.password}</p>}

            <label>Confirm Password</label>
            <input type={showPassword ? "text" : "password"} value={signup.confirm} onChange={(e) => setSignup({ ...signup, confirm: e.target.value })} />
            {signupErrors.confirm && <p className="error">{signupErrors.confirm}</p>}

            <label className="checkbox">
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword((s) => !s)} /> Show Password
            </label>

            <button type="submit" disabled={loading} className="submit">
              {loading ? "Creating…" : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
