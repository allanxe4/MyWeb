// Registration Form Handler
class RegisterForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.submitBtn = this.form.querySelector('.login-btn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.successMessage = document.getElementById('successMessage');
        this.isSubmitting = false;
        
        this.validators = {
            username: this.validateUsername.bind(this),
            email: FormUtils.validateEmail,
            password: FormUtils.validatePassword,
            confirmPassword: this.validateConfirmPassword.bind(this)
        };
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        FormUtils.setupFloatingLabels(this.form);
        this.addInputAnimations();
        FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
        FormUtils.setupPasswordToggle(this.confirmPasswordInput, this.confirmPasswordToggle);
        FormUtils.addSharedAnimations();
    }
    
    addEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => FormUtils.clearError(fieldName));
            }
        });
        
        // Enhanced focus effects
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
        });
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    addInputAnimations() {
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    handleFocus(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.add('focused');
        }
    }
    
    handleBlur(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.remove('focused');
        }
    }
    
    validateUsername(username) {
        if (!username) {
            return { isValid: false, message: 'Username is required' };
        }
        
        if (username.length < 3) {
            return { isValid: false, message: 'Username must be at least 3 characters' };
        }
        
        if (username.length > 20) {
            return { isValid: false, message: 'Username must be less than 20 characters' };
        }
        
        return { isValid: true };
    }
    
    validateConfirmPassword(confirmPassword) {
        const password = document.getElementById('password').value;
        
        if (!confirmPassword) {
            return { isValid: false, message: 'Confirm password is required' };
        }
        
        if (confirmPassword !== password) {
            return { isValid: false, message: 'Passwords do not match' };
        }
        
        return { isValid: true };
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const isValid = this.validateForm();
        
        if (isValid) {
            await this.submitForm();
        } else {
            this.shakeForm();
        }
    }
    
    validateForm() {
        let isValid = true;
        
        Object.keys(this.validators).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const validator = this.validators[fieldName];
        
        if (!field || !validator) return true;
        
        const result = validator(field.value.trim(), field);
        
        if (result.isValid) {
            FormUtils.clearError(fieldName);
            FormUtils.showSuccess(fieldName);
        } else {
            FormUtils.showError(fieldName, result.message);
        }
        
        return result.isValid;
    }
    
    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }
    
    async submitForm() {
        this.isSubmitting = true;
        this.submitBtn.classList.add('loading');
        
        try {
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Save user to database
            FormUtils.saveUser({
                username: username,
                email: email,
                password: password
            });
            
            // Store current user in localStorage for session
            localStorage.setItem('currentUser', username);
            localStorage.setItem('currentUserEmail', email);
            localStorage.setItem('loginTimestamp', new Date().toISOString());
            
            // Show success state
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showRegisterError(error.message);
        } finally {
            this.isSubmitting = false;
            this.submitBtn.classList.remove('loading');
        }
    }
    
    showSuccessMessage() {
        // Hide form with smooth animation
        this.form.style.opacity = '0';
        this.form.style.transform = 'translateY(-20px)';
        
        // Hide other elements
        const elementsToHide = ['.signup-link'];
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(-20px)';
            }
        });
        
        setTimeout(() => {
            this.form.style.display = 'none';
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });
            
            this.successMessage.classList.add('show');
            
            // Redirect to home page
            setTimeout(() => {
                this.redirectToHome();
            }, 2000);
        }, 300);
    }
    
    redirectToHome() {
        window.location.href = '../index.html';
    }
    
    showRegisterError(message) {
        FormUtils.showNotification(message || 'Registration failed. Please try again.', 'error', this.form);
        
        // Shake the entire card
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Enter key submits form if focus is on form elements
            if (e.key === 'Enter' && e.target.closest('#registerForm')) {
                e.preventDefault();
                this.handleSubmit(e);
            }
            
            // Escape key clears errors
            if (e.key === 'Escape') {
                Object.keys(this.validators).forEach(fieldName => {
                    FormUtils.clearError(fieldName);
                });
            }
        });
    }
}

// Initialize the register form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new RegisterForm();
});
