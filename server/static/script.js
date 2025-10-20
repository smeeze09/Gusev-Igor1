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
        console.error('Ошибка при загрузке видов спорта:', error);
        // Если API недоступно, используем статический список
        const staticSports = ['бокс', 'кикбоксинг', 'муай-тай', 'BJJ', 'вольная борьба', 'тхэквондо', 'ОФП'];
        const select = document.getElementById('sport_type');
        if (select) {
            select.innerHTML = '<option value="">Выберите вид спорта</option>';
            staticSports.forEach(sport => {
                const option = document.createElement('option');
                option.value = sport;
                option.textContent = sport.charAt(0).toUpperCase() + sport.slice(1);
                select.appendChild(option);
            });
        }
    }
}

// Загружаем виды спорта при загрузке страницы
document.addEventListener('DOMContentLoaded', loadSports);

// Загрузка изображений компонентов
async function loadComponentImages() {
    try {
        const response = await fetch('/api/images/');
        const images = await response.json();
        
        console.log('Загружены изображения:', images);
        
        // Создаем объект для быстрого поиска изображений по компоненту
        const imagesByComponent = {};
        images.forEach(image => {
            // Преобразуем ссылки Google Drive в прямые ссылки
            if (image.image_url && image.image_url.includes('drive.google.com')) {
                const fileId = image.image_url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
                if (fileId) {
                    image.image_url = `https://drive.google.com/uc?id=${fileId[1]}`;
                }
            }
            imagesByComponent[image.component] = image;
        });
        
        console.log('Обработанные изображения:', imagesByComponent);
        
        // Обновляем изображения на странице
        updateComponentImages(imagesByComponent);
    } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
    }
}

// Обновление изображений компонентов на странице
function updateComponentImages(imagesByComponent) {
    console.log('Обновляем изображения:', imagesByComponent);
    
    // Обновляем логотип в навбаре
    const logo = document.querySelector('.nav-logo .logo-link');
    if (imagesByComponent.logo && logo) {
        console.log('Обновляем логотип:', imagesByComponent.logo.image_url);
        logo.innerHTML = `<img src="${imagesByComponent.logo.image_url}" alt="${imagesByComponent.logo.alt_text}" style="height: 40px;">`;
    }
    
    // Обновляем фоновое изображение героя
    const heroSection = document.querySelector('.hero-section');
    if (imagesByComponent.hero && heroSection) {
        console.log('Обновляем фоновое изображение героя:', imagesByComponent.hero.image_url);
        // Устанавливаем только изображение без фиолетового градиента
        heroSection.style.background = `url('${imagesByComponent.hero.image_url}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        heroSection.style.backgroundRepeat = 'no-repeat';
    }
    
    // Обновляем изображения лотов
    const lotCards = document.querySelectorAll('.lot-card');
    lotCards.forEach((card, index) => {
        const componentKey = `lot${index + 1}`;
        if (imagesByComponent[componentKey]) {
            console.log(`Обновляем лот ${index + 1}:`, imagesByComponent[componentKey].image_url);
            
            // Удаляем старое изображение если есть
            const oldImg = card.querySelector('img.lot-image');
            if (oldImg) {
                oldImg.remove();
            }
            
            // Создаем новое изображение
            const img = document.createElement('img');
            img.src = imagesByComponent[componentKey].image_url;
            img.alt = imagesByComponent[componentKey].alt_text;
            img.className = 'lot-image';
            img.style.cssText = 'width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; display: block;';
            
            // Обработка ошибок загрузки изображения
            img.onerror = function() {
                console.error('Ошибка загрузки изображения:', imagesByComponent[componentKey].image_url);
                this.style.display = 'none';
                // Показываем заглушку
                const placeholder = document.createElement('div');
                placeholder.style.cssText = 'width: 100%; height: 200px; background: #f0f0f0; border-radius: 10px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; color: #999;';
                placeholder.textContent = 'Изображение недоступно';
                card.insertBefore(placeholder, card.firstChild);
            };
            
            img.onload = function() {
                console.log('Изображение загружено:', imagesByComponent[componentKey].image_url);
            };
            
            // Вставляем в начало карточки
            card.insertBefore(img, card.firstChild);
        }
    });
    
    // Обновляем изображение в секции "Об аукционе"
    const aboutSection = document.querySelector('.about-section');
    if (imagesByComponent.about && aboutSection) {
        console.log('Обновляем изображение секции "Об аукционе":', imagesByComponent.about.image_url);
        
        // Удаляем старое изображение если есть
        const oldImage = aboutSection.querySelector('.about-image');
        if (oldImage) {
            oldImage.remove();
        }
        
        // Создаем новое изображение
        const aboutImage = document.createElement('div');
        aboutImage.className = 'about-image';
        aboutImage.style.cssText = `
            width:  30%;
            height: 300px;
            background-image: url('${imagesByComponent.about.image_url}');
            background-size: cover;
            background-position: center;
            border-radius: 15px;
            margin-bottom: 30px;
            display: block;
        `;
        aboutImage.setAttribute('aria-label', imagesByComponent.about.alt_text);
        
        // Вставляем после заголовка
        const title = aboutSection.querySelector('.section-title');
        if (title) {
            title.insertAdjacentElement('afterend', aboutImage);
        }
    }
    
    // Обновляем фоновое изображение секции тренировок
    const trainingSection = document.querySelector('.training-section');
    if (imagesByComponent.training && trainingSection) {
        console.log('Обновляем фоновое изображение секции тренировок:', imagesByComponent.training.image_url);
        trainingSection.style.background = `url('${imagesByComponent.training.image_url}') center/cover no-repeat`;
        trainingSection.style.position = 'relative';
        
        // Добавляем оверлей для читаемости
        let overlay = trainingSection.querySelector('.section-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'section-overlay';
            trainingSection.insertBefore(overlay, trainingSection.firstChild);
        }
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(248, 249, 250, 0.9);
            z-index: 1;
        `;
        
        // Поднимаем контент над оверлеем
        const container = trainingSection.querySelector('.container');
        if (container) {
            container.style.position = 'relative';
            container.style.zIndex = '2';
        }
    }
}

// Настройка кнопки "Сделать ставку"
function setupBidButton() {
    const bidButton = document.getElementById('bidButton');
    if (bidButton) {
        bidButton.addEventListener('click', function() {
            // Прокручиваем к секции лотов
            const lotsSection = document.getElementById('lots');
            if (lotsSection) {
                lotsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Добавляем эффект нажатия
            bidButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                bidButton.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Эффект при наведении
        bidButton.addEventListener('mouseenter', function() {
            this.style.background = 'white';
            this.style.color = 'black';
        });
        
        bidButton.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.color = '';
        });
    }
}

// Настройка мобильного меню
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Закрываем меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Загружаем изображения при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadComponentImages();
    setupBidButton();
    setupMobileMenu();
});

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
        errors.push('интересуещий вами лот ');
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
                sport_type: formData.get('selection')
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
