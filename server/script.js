// Навигационное меню для мобильных устройств
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Анимация гамбургера
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Учитываем высоту навбара
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Обработка формы тренировок
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trainingForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                sport_type: formData.get('sport_type')
            };
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/application/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                    form.reset();
                } else {
                    let errorMessage = 'Ошибка при отправке заявки';
                    if (result.errors) {
                        const errors = Object.values(result.errors).flat();
                        errorMessage = errors.join('\n');
                    }
                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Функция для получения CSRF токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Загрузка видов спорта из API
async function loadSports() {
    try {
        const response = await fetch('/api/sports/');
        const sports = await response.json();
        
        const select = document.getElementById('sport_type');
        if (select) {
            // Очищаем существующие опции (кроме первой)
            select.innerHTML = '<option value="">Выберите вид спорта</option>';
            
            // Добавляем новые опции
            sports.forEach(sport => {
                const option = document.createElement('option');
                option.value = sport;
                option.textContent = sport.charAt(0).toUpperCase() + sport.slice(1);
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Ошибка при выбори лота :', error);
        // Если API недоступно, используем статический список
        const staticSports = [];
        const select = document.getElementById('lot');
        if (select) {
            select.innerHTML = '<option value="">Выберите лот</option>';
            staticSports.forEach(lot => {
                const option = document.createElement('option');
                option.value = lot;
                option.textContent = lot.charAt(0).toUpperCase() + lot.slice(1);
                select.appendChild(option);
            });
        }
    }
}

// Загружаем лоты при загрузке страницы
document.addEventListener('DOMContentLoaded', loadSports);

// Эффект параллакса для героя
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за элементами для анимации
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.lot-card, .feature, .about-text, .training-form');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Изменение стиля навбара при прокрутке
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Обработка клика по заголовкам лотов
document.addEventListener('DOMContentLoaded', function() {
    const lotTitles = document.querySelectorAll('.lot-title');
    
    lotTitles.forEach(title => {
        title.addEventListener('click', function() {
            // Здесь можно добавить логику для открытия детальной страницы лота
            alert('Открывается детальная информация о лоте: ' + this.textContent);
        });
    });
});

// Обработка кнопки "Посмотреть больше"
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreBtn = document.querySelector('.view-more-btn');
    
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function() {
            // Здесь можно добавить логику для загрузки дополнительных лотов
            alert('Загружаются дополнительные лоты...');
        });
    }
});

// Валидация формы
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Имя должно содержать минимум 2 символа');
    }
    
    if (!formData.phone || !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
        errors.push('Введите корректный номер телефона');
    }
    
    if (!formData.sport_type) {
        errors.push('Выберите вид спорта');
    }
    
    return errors;
}

// Улучшенная отправка формы с валидацией
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('trainingForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                sport_type: formData.get('sport_type')
            };
            
            // Валидация
            const errors = validateForm(data);
            if (errors.length > 0) {
                alert('Ошибки в форме:\n' + errors.join('\n'));
                return;
            }
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/application', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                    form.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка при отправке заявки');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
