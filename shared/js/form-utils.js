// Shared Form Utilities for all forms

class FormUtils {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^(?!.*@)[^\s@]+$/;
        
        if (!email) {
            return { isValid: false, message: 'Email/Username is required' };
        }
        
        if (email.length < 3) {
            return { isValid: false, message: 'Email/Username must be at least 3 characters' };
        }
        
        if (email.includes('@') && !emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email' };
        }
        
        return { isValid: true };
    }
    
    static validatePassword(password) {
        if (!password) {
            return { isValid: false, message: 'Password is required' };
        }
        
        if (password.length < 4) {
            return { isValid: false, message: 'Password must be at least 4 characters' };
        }
        
        return { isValid: true };
    }
    
    static clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field?.closest('.form-group');
        const errorMessage = formGroup?.querySelector('.error-message');
        
        if (formGroup) {
            formGroup.classList.remove('error');
        }
        
        if (errorMessage) {
            errorMessage.classList.remove('show');
            errorMessage.textContent = '';
        }
        
        if (field) {
            field.classList.remove('invalid');
        }
    }
    
    static showSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field?.closest('.form-group');
        
        if (field) {
            field.classList.add('valid');
        }
        
        if (formGroup) {
            formGroup.classList.remove('error');
        }
    }
    
    static showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field?.closest('.form-group');
        const errorMessage = formGroup?.querySelector('.error-message');
        
        if (formGroup) {
            formGroup.classList.add('error');
        }
        
        if (field) {
            field.classList.add('invalid');
        }
        
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }
    }
    
    static setupFloatingLabels(form) {
        const inputs = form.querySelectorAll('input');
        
        inputs.forEach(input => {
            if (input.value) {
                input.classList.add('has-value');
            }
            
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
            
            input.addEventListener('focus', () => {
                input.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.classList.remove('focused');
            });
        });
    }
    
    static setupPasswordToggle(passwordInput, toggleButton) {
        if (!passwordInput || !toggleButton) return;
        
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            const eyeIcon = toggleButton.querySelector('.eye-icon');
            if (eyeIcon) {
                eyeIcon.classList.toggle('show-password');
            }
            
            // Add pulse animation
            toggleButton.style.transform = 'scale(1.2)';
            setTimeout(() => {
                toggleButton.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    static addSharedAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .form-group input {
                animation: fadeIn 0.6s ease-out forwards;
            }
            
            .eye-icon::before {
                content: '👁️';
                font-size: 18px;
            }
            
            .eye-icon.show-password::before {
                content: '👁️‍🗨️';
            }
        `;
        document.head.appendChild(style);
    }
    
    static addEntranceAnimation(element) {
        if (!element) return;
        const style = document.createElement('style');
        style.textContent = `
            @keyframes entranceSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .entrance-animation {
                animation: entranceSlideUp 0.6s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
        element.classList.add('entrance-animation');
    }
    
    static async simulateLogin(email, password) {
        // Simulate network request delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simple validation - in real app, verify with server
                if (email && password) {
                    // Store username in localStorage for home page display
                    localStorage.setItem('currentUser', email);
                    localStorage.setItem('loginTimestamp', new Date().toISOString());
                    
                    resolve({
                        success: true,
                        message: 'Login successful',
                        user: {
                            email: email,
                            loginTime: new Date()
                        }
                    });
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1500); // Simulate 1.5s network delay
        });
    }
    
    static showNotification(message, type = 'info', container = null) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                animation: slideInRight 0.3s ease-out;
                backdrop-filter: blur(10px);
            }
            
            .notification-info {
                background: rgba(59, 130, 246, 0.9);
                color: white;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }
            
            .notification-error {
                background: rgba(239, 68, 68, 0.9);
                color: white;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }
            
            .notification-success {
                background: rgba(34, 197, 94, 0.9);
                color: white;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // User Database Management
    static getAllUsers() {
        const users = localStorage.getItem('registeredUsers');
        console.log('Getting all users from localStorage:', users);
        return users ? JSON.parse(users) : [];
    }
    
    static saveUser(userData) {
        const users = this.getAllUsers();
        
        // Check if user already exists
        const userExists = users.some(user => 
            user.email === userData.email || user.username === userData.username
        );
        
        if (userExists) {
            throw new Error('Username atau Email sudah terdaftar');
        }
        
        // Add new user
        users.push({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            registeredAt: new Date().toISOString()
        });
        
        console.log('Saving user to database:', userData);
        console.log('All users after save:', users);
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        console.log('localStorage updated:', localStorage.getItem('registeredUsers'));
        
        return true;
    }
    
    static validateUserLogin(email, password) {
        const users = this.getAllUsers();
        
        console.log('Attempting to validate login for email/username:', email);
        console.log('Available users in database:', users);
        
        // Find user by email or username
        const user = users.find(u => {
            console.log('Comparing:', {
                storedEmail: u.email,
                storedUsername: u.username,
                inputEmail: email,
                emailMatch: u.email === email,
                usernameMatch: u.username === email
            });
            return (u.email === email || u.username === email) && u.password === password;
        });
        
        if (!user) {
            console.log('User not found or password mismatch');
            throw new Error('Username/Email atau Password salah');
        }
        
        console.log('User found:', user);
        return user;
    }
    
    // Get stored user information
    static getCurrentUser() {
        return localStorage.getItem('currentUser');
    }
    
    // Logout function
    static logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTimestamp');
    }
}
