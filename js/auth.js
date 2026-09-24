/**
 * Auth: login, logout, session guard, auth state listener.
 */

async function signIn(email, password) {
  if (!navigator.onLine) {
    return { success: false, error: 'No internet connection.' };
  }
  if (!isSupabaseConfigured() || !supabaseClient) {
    return { success: false, error: 'App is not configured. Check Supabase credentials.' };
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.session) {
      return { success: false, error: 'Login failed. Check your credentials.' };
    }
    return { success: true };
  } catch {
    return {
      success: false,
      error: navigator.onLine
        ? 'Something went wrong. Please try again.'
        : 'No internet connection.',
    };
  }
}

async function signOut() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  window.location.replace('index.html');
}

async function getSession() {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session) return null;
  return data.session;
}

async function getCurrentUser() {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.replace('index.html?reason=session');
    return null;
  }
  return session;
}

async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) window.location.replace('list.html');
}

function watchAuthState(onSignedOut) {
  if (!supabaseClient) return;
  supabaseClient.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' && typeof onSignedOut === 'function') {
      onSignedOut();
    }
  });
}

function initPasswordToggle() {
  const input = document.getElementById('password');
  const toggle = document.getElementById('password-toggle');
  if (!input || !toggle) return;

  toggle.addEventListener('click', () => {
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    toggle.setAttribute('aria-pressed', showing ? 'false' : 'true');
  });
}

function initLoginPage() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit');
  if (!form) return;

  initPasswordToggle();

  const params = new URLSearchParams(window.location.search);
  if (errorEl && params.get('reason') === 'session') {
    errorEl.textContent = 'Session expired. Please login again.';
  }

  if (!supabaseClient) {
    if (errorEl) errorEl.textContent = 'Could not load auth library. Refresh and try again.';
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  redirectIfAuthenticated();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.textContent = '';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    const result = await signIn(
      document.getElementById('email').value,
      document.getElementById('password').value
    );

    if (!result.success) {
      if (errorEl) errorEl.textContent = result.error;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
      return;
    }

    window.location.replace('list.html');
  });
}
