
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        primary: "#00529B", // A professional blue
                        "background-light": "#F8FAFC",
                        "background-dark": "#0B1120",
                        "card-light": "#FFFFFF",
                        "card-dark": "#1E293B",
                        "text-light": "#1E293B",
                        "text-dark": "#E2E8F0",
                        "text-muted-light": "#64748B",
                        "text-muted-dark": "#94A3B8",
                    },
                    fontFamily: {
                        display: ["Poppins", "sans-serif"],
                    },
                    borderRadius: {
                        DEFAULT: "0.5rem",
                    },
                    animation: {
                        'subtle-pan': 'subtle-pan 30s ease infinite',
                        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
                        'scale-in': 'scale-in 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
                    },
                    keyframes: {
                        'fade-in-up': {
                          '0%': { opacity: '0', transform: 'translateY(20px)' },
                          '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        'fade-in-down': {
                          '0%': { opacity: '0', transform: 'translateY(-20px)' },
                          '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        'scale-in': {
                            '0%': { transform: 'scale(0.5)', opacity: '0'},
                            '100%': { transform: 'scale(1)', opacity: '1'}
                        }
                    }
                },
            },
        };
        // Simple script to toggle dark mode
        function toggleDarkMode() {
            document.documentElement.classList.toggle('dark');
        }
        // Dummy validation for demo purposes
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contact-form');
            if (form) {
                form.addEventListener('input', (event) => {
                    const input = event.target;
                    const errorElement = input.closest('.relative').querySelector('.error-message');
                    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                        if (input.checkValidity()) {
                            input.classList.remove('border-red-500');
                            input.classList.add('border-green-500');
                             if(errorElement) errorElement.textContent = '';
                        } else {
                            input.classList.remove('border-green-500');
                            input.classList.add('border-red-500');
                             if(errorElement) errorElement.textContent = input.validationMessage;
                        }
                    }
                });
            }
        });