// Validation utility functions

/**
 * Validates that a value is not empty
 * @param {string} value - The value to validate
 * @param {string} fieldName - The name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `${fieldName} es obligatorio`;
  }
  return null;
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'El email es obligatorio';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El email no tiene un formato válido';
  }
  
  return null;
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @param {number} minLength - Minimum length requirement
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password || !password.trim()) {
    return 'La contraseña es obligatoria';
  }
  
  if (password.length < minLength) {
    return `La contraseña debe tener al menos ${minLength} caracteres`;
  }
  
  return null;
};

/**
 * Validates that a selection has been made
 * @param {string|number} value - The value to validate
 * @param {string} fieldName - The name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateSelection = (value, fieldName) => {
  if (!value) {
    return `Debe seleccionar ${fieldName}`;
  }
  return null;
};

/**
 * Validates user creation form
 * @param {Object} formData - The form data to validate
 * @param {number} roleId - The role ID to determine specific validations
 * @returns {Object} Validation result with isValid flag and errors array
 */
export const validateUserCreationForm = (formData, roleId) => {
  const errors = [];
  
  // Common validations for all user types
  const nameError = validateRequired(formData.name, 'El nombre');
  if (nameError) errors.push(nameError);
  
  const lastNameError = validateRequired(formData.lastName, 'El apellido');
  if (lastNameError) errors.push(lastNameError);
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.push(passwordError);
  
  // Role-specific validations
  if (roleId === 2) { // Mechanic
    const bossError = validateSelection(formData.bossId, 'un jefe de mecánicos');
    if (bossError) errors.push(bossError);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates mechanic creation form for boss interface
 * @param {Object} formData - The form data to validate
 * @param {number} bossId - The boss ID
 * @returns {Object} Validation result with isValid flag and errors array
 */
export const validateMechanicCreationForm = (formData, bossId) => {
  const errors = [];
  
  // Validate required fields
  const nameError = validateRequired(formData.name, 'El nombre');
  if (nameError) errors.push(nameError);
  
  const lastNameError = validateRequired(formData.lastName, 'El apellido');
  if (lastNameError) errors.push(lastNameError);
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.push(passwordError);
  
  // Validate boss assignment
  if (!bossId) {
    errors.push('Debe asignar un jefe de mecánicos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};