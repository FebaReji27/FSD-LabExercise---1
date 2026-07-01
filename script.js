const registrationForm = document.querySelector('#registration-form');
const registerButton = document.querySelector('#register-btn');
const resetButton = document.querySelector('#reset-btn');
const successBox = document.querySelector('#registration-success');
const outputBox = document.querySelector('#registration-output');
const historyBox = document.querySelector('#registration-history');
const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('#password-toggle');
const passwordStrength = document.querySelector('#password-strength');

const clearErrors = () => {
  document.querySelectorAll('.field-error').forEach((error) => {
    error.textContent = '';
  });

  document.querySelectorAll('.registration-input').forEach((field) => {
    field.classList.remove('invalid');
  });
};

const setError = (fieldId, message) => {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`[data-error-for="${fieldId}"]`);

  if (field) {
    field.classList.add('invalid');
  }

  if (error) {
    error.textContent = message;
  }
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
const validatePasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: 'Weak', className: 'weak' };
  if (score <= 4) return { label: 'Medium', className: 'medium' };
  return { label: 'Strong', className: 'strong' };
};
const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

const getSelectedInterests = () => {
  const selected = [];
  document.querySelectorAll('input[name="travelInterest"]:checked').forEach((checkbox) => {
    selected.push(checkbox.value);
  });
  return selected;
};

const renderSummary = (data) => {
  const interests = data.interests.join(', ');

  outputBox.innerHTML = `
    <div class="registration-summary-card">
      <h3>Registration Successful</h3>
      <p><strong>Full Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Mobile Number:</strong> ${data.mobile}</p>
      <p><strong>Date of Birth:</strong> ${data.dob}</p>
      <p><strong>Preferred Destination:</strong> ${data.destination}</p>
      <p><strong>Gender:</strong> ${data.gender}</p>
      <p><strong>Travel Interests:</strong> ${interests}</p>
      <p><strong>Address:</strong> ${data.address}</p>
    </div>
  `;
};

const saveRegistration = (data) => {
  const existing = JSON.parse(localStorage.getItem('travelRegistrations') || '[]');
  existing.push(data);
  localStorage.setItem('travelRegistrations', JSON.stringify(existing));
  renderHistory();
};

const renderHistory = () => {
  const registrations = JSON.parse(localStorage.getItem('travelRegistrations') || '[]');

  if (registrations.length === 0) {
    historyBox.innerHTML = '<div class="history-empty">No registrations saved yet.</div>';
    return;
  }

  historyBox.innerHTML = registrations.slice().reverse().map((entry) => `
    <div class="history-item">
      <p><strong>${entry.fullName}</strong></p>
      <p>${entry.email}</p>
      <p>${entry.mobile}</p>
    </div>
  `).join('');
};

const showSuccess = () => {
  successBox.innerHTML = '<div class="success-pill">Registration completed successfully. We will contact you soon.</div>';
};

const displayRegistrationCard = () => {
  outputBox.style.display = 'grid';
};

const handleRegister = () => {
  clearErrors();

  const fullName = document.querySelector('#full-name').value.trim();
  const email = document.querySelector('#email-address').value.trim();
  const password = document.querySelector('#password').value;
  const mobile = document.querySelector('#mobile-number').value.trim();
  const dob = document.querySelector('#dob').value;
  const destination = document.querySelector('#destination').value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
  const interests = getSelectedInterests();
  const address = document.querySelector('#address').value.trim();
  const termsAccepted = document.querySelector('#terms').checked;

  let isValid = true;

  if (!fullName) {
    setError('full-name', 'Full Name is required.');
    isValid = false;
  }

  if (!validateEmail(email)) {
    setError('email-address', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!validatePassword(password)) {
    setError('password', 'Password should be at least 8 characters and include uppercase, lowercase, and a number.');
    isValid = false;
  }

  if (!validateMobile(mobile)) {
    setError('mobile-number', 'Mobile Number must contain exactly 10 digits.');
    isValid = false;
  }

  if (!dob) {
    setError('dob', 'Please select your date of birth.');
    isValid = false;
  }

  if (!destination) {
    setError('destination', 'Please select a preferred destination.');
    isValid = false;
  }

  if (!gender) {
    setError('gender', 'Please select your gender.');
    isValid = false;
  }

  if (interests.length === 0) {
    setError('travel-interest', 'Please select at least one travel interest.');
    isValid = false;
  }

  if (!address) {
    setError('address', 'Address is required.');
    isValid = false;
  }

  if (!termsAccepted) {
    setError('terms', 'You must accept the Terms & Conditions.');
    isValid = false;
  }

  if (!isValid) {
    successBox.innerHTML = '';
    outputBox.innerHTML = '';
    return;
  }

  const formData = {
    fullName,
    email,
    mobile,
    dob,
    destination,
    gender,
    interests,
    address
  };

  renderSummary(formData);
  saveRegistration(formData);
  showSuccess();
  displayRegistrationCard();
  registrationForm.reset();
  passwordStrength.textContent = '';
  passwordStrength.className = 'password-strength';
};

registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  handleRegister();
});

passwordInput.addEventListener('input', () => {
  const strength = validatePasswordStrength(passwordInput.value);
  passwordStrength.textContent = `Password strength: ${strength.label}`;
  passwordStrength.className = `password-strength ${strength.className}`;
});

passwordToggle.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  passwordToggle.textContent = isHidden ? '🙈' : '👁';
  passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
});

registerButton.addEventListener('click', (event) => {
  event.preventDefault();
  handleRegister();
});

resetButton.addEventListener('click', () => {
  clearErrors();
  successBox.innerHTML = '';
  outputBox.innerHTML = '';
  passwordStrength.textContent = '';
  passwordStrength.className = 'password-strength';
});

renderHistory();
