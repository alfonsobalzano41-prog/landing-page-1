/* ==================== SMOOTH SCROLL ==================== */
document.querySelectorAll('[data-scroll-to]').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ==================== FORM VALIDATION ==================== */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Validazione email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validazione telefono
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Mostra errore
function showError(fieldName, message) {
    const errorElement = document.querySelector(`[data-field="${fieldName}"]`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Nascondi errore
function clearError(fieldName) {
    const errorElement = document.querySelector(`[data-field="${fieldName}"]`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Validazione file
function isValidFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSize) {
        return false;
    }
    return true;
}

// Validazione form
function validateForm() {
    let isValid = true;

    // Nome
    const nome = form.querySelector('#nome').value.trim();
    if (!nome) {
        showError('nome', 'Nome è obbligatorio');
        isValid = false;
    } else {
        clearError('nome');
    }

    // Email
    const email = form.querySelector('#email').value.trim();
    if (!email) {
        showError('email', 'Email è obbligatoria');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Email non valida');
        isValid = false;
    } else {
        clearError('email');
    }

    // Telefono (obbligatorio se checkbox spuntato)
    const telefono = form.querySelector('#telefono').value.trim();
    const richiamato = form.querySelector('#richiamato').checked;
    
    if (richiamato && !telefono) {
        showError('telefono', 'Telefono è obbligatorio se desideri essere richiamato');
        isValid = false;
    } else if (telefono && !isValidPhone(telefono)) {
        showError('telefono', 'Telefono non valido');
        isValid = false;
    } else {
        clearError('telefono');
    }

    // Servizio
    const servizio = form.querySelector('#servizio').value;
    if (!servizio) {
        showError('servizio', 'Seleziona un servizio');
        isValid = false;
    } else {
        clearError('servizio');
    }

    // Descrizione progetto
    const progetto = form.querySelector('#progetto').value.trim();
    if (!progetto) {
        showError('progetto', 'Descrivi il tuo progetto');
        isValid = false;
    } else {
        clearError('progetto');
    }

    // File (max 5MB)
    const fileInput = form.querySelector('#file');
    if (fileInput.files.length > 0) {
        if (!isValidFile(fileInput.files[0])) {
            showError('file', 'File troppo grande (max 5MB)');
            isValid = false;
        } else {
            clearError('file');
        }
    }

    // Privacy
    const privacy = form.querySelector('#privacy').checked;
    if (!privacy) {
        showError('privacy', 'Accetta la privacy policy');
        isValid = false;
    } else {
        clearError('privacy');
    }

    return isValid;
}

// Submit form
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateForm()) {
        // Raccogliere dati
        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            richiamato: formData.get('richiamato') ? 'Sì' : 'No',
            servizio: formData.get('servizio'),
            progetto: formData.get('progetto'),
            misura: formData.get('misura'),
            timestamp: new Date().toLocaleString('it-IT')
        };

        // Log dei dati (in produzione, inviare a un backend)
        console.log('Form inviato:', data);

        // Mostra messaggio di successo
        form.style.display = 'none';
        formSuccess.style.display = 'block';

        // Scroll al messaggio di successo
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Reset form e ripristina dopo 3 secondi
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            formSuccess.style.display = 'none';
        }, 3000);
    }
});

/* ==================== CHECKBOX TELEFONO ==================== */
const checkboxRichiamato = form.querySelector('#richiamato');
const inputTelefono = form.querySelector('#telefono');

checkboxRichiamato.addEventListener('change', function() {
    if (this.checked) {
        inputTelefono.setAttribute('required', 'required');
        inputTelefono.style.borderColor = '#6BA3D4';
    } else {
        inputTelefono.removeAttribute('required');
        inputTelefono.style.borderColor = '#D0D0D0';
        clearError('telefono');
    }
});

/* ==================== SCROLL ANIMATIONS ==================== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            entry.target.offsetHeight; // Trigger reflow
            entry.target.style.animation = '';
        }
    });
}, observerOptions);

// Osserva tutti gli elementi con animazioni
document.querySelectorAll('.why-card, .method-card, .case-study').forEach(el => {
    observer.observe(el);
});

/* ==================== INPUT FOCUS EFFECTS ==================== */
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '#6BA3D4';
    });

    input.addEventListener('blur', function() {
        this.style.borderColor = '#D0D0D0';
    });
});

/* ==================== VALIDAZIONE REAL-TIME ==================== */
form.querySelector('#nome').addEventListener('blur', function() {
    if (!this.value.trim()) {
        showError('nome', 'Nome è obbligatorio');
    } else {
        clearError('nome');
    }
});

form.querySelector('#email').addEventListener('blur', function() {
    if (!this.value.trim()) {
        showError('email', 'Email è obbligatoria');
    } else if (!isValidEmail(this.value.trim())) {
        showError('email', 'Email non valida');
    } else {
        clearError('email');
    }
});

form.querySelector('#telefono').addEventListener('blur', function() {
    if (this.value.trim() && !isValidPhone(this.value.trim())) {
        showError('telefono', 'Telefono non valido');
    } else {
        clearError('telefono');
    }
});

form.querySelector('#servizio').addEventListener('change', function() {
    if (!this.value) {
        showError('servizio', 'Seleziona un servizio');
    } else {
        clearError('servizio');
    }
});

form.querySelector('#progetto').addEventListener('blur', function() {
    if (!this.value.trim()) {
        showError('progetto', 'Descrivi il tuo progetto');
    } else {
        clearError('progetto');
    }
});

form.querySelector('#privacy').addEventListener('change', function() {
    if (!this.checked) {
        showError('privacy', 'Accetta la privacy policy');
    } else {
        clearError('privacy');
    }
});

/* ==================== VALIDAZIONE FILE ==================== */
form.querySelector('#file').addEventListener('change', function() {
    if (this.files.length > 0) {
        if (!isValidFile(this.files[0])) {
            showError('file', 'File troppo grande (max 5MB)');
            this.value = '';
        } else {
            clearError('file');
        }
    }
});
