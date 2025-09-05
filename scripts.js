// Mr Quickie Website JavaScript

// WordPress Emoji Settings
window._wpemojiSettings = {
    "baseUrl": "https://s.w.org/images/core/emoji/16.0.1/72x72/",
    "ext": ".png",
    "svgUrl": "https://s.w.org/images/core/emoji/16.0.1/svg/",
    "svgExt": ".svg",
    "source": {
        "concatemoji": "https://mrquickie.com/wp-includes/js/wp-emoji-release.min.js?ver=6.8.2"
    }
};

// Emoji Support Detection
(function(window, document) {
    var o, i, e;
    
    function c(e) {
        try {
            var t = {
                supportTests: e,
                timestamp: (new Date).valueOf()
            };
            sessionStorage.setItem(o, JSON.stringify(t));
        } catch(e) {}
    }
    
    function p(e, t, n) {
        e.clearRect(0, 0, e.canvas.width, e.canvas.height);
        e.fillText(t, 0, 0);
        var t = new Uint32Array(e.getImageData(0, 0, e.canvas.width, e.canvas.height).data);
        e.clearRect(0, 0, e.canvas.width, e.canvas.height);
        e.fillText(n, 0, 0);
        var a = new Uint32Array(e.getImageData(0, 0, e.canvas.width, e.canvas.height).data);
        return t.every(function(e, t) {
            return e === a[t];
        });
    }
    
    function u(e, t) {
        e.clearRect(0, 0, e.canvas.width, e.canvas.height);
        e.fillText(t, 0, 0);
        for (var n = e.getImageData(16, 16, 1, 1), a = 0; a < n.data.length; a++)
            if (0 !== n.data[a]) return false;
        return true;
    }
    
    function f(e, t, n, a) {
        switch (t) {
            case "flag":
                return n(e, "\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f", "\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f") ? false : !n(e, "\ud83c\udde8\ud83c\uddf6", "\ud83c\udde8\u200b\ud83c\uddf6") && !n(e, "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f", "\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f");
            case "emoji":
                return !a(e, "\ud83e\udedf");
        }
        return false;
    }
    
    function g(e, t, n, a) {
        var r = "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? new OffscreenCanvas(300, 150) : document.createElement("canvas"),
            o = r.getContext("2d", {
                willReadFrequently: true
            }),
            i = (o.textBaseline = "top", o.font = "600 32px Arial", {});
        return e.forEach(function(e) {
            i[e] = t(o, e, n, a);
        }), i;
    }
    
    function t(e) {
        var t = document.createElement("script");
        t.src = e;
        t.defer = true;
        document.head.appendChild(t);
    }
    
    if ("undefined" != typeof Promise) {
        o = "wpEmojiSettingsSupports";
        i = ["flag", "emoji"];
        window.supports = {
            everything: true,
            everythingExceptFlag: true
        };
        e = new Promise(function(e) {
            document.addEventListener("DOMContentLoaded", e, {
                once: true
            });
        });
        new Promise(function(t) {
            var n = function() {
                try {
                    var e = JSON.parse(sessionStorage.getItem(o));
                    if ("object" == typeof e && "number" == typeof e.timestamp && (new Date).valueOf() < e.timestamp + 604800 && "object" == typeof e.supportTests)
                        return e.supportTests;
                } catch(e) {}
                return null;
            }();
            if (!n) {
                if ("undefined" != typeof Worker && "undefined" != typeof OffscreenCanvas && "undefined" != typeof URL && URL.createObjectURL && "undefined" != typeof Blob) try {
                    var e = "postMessage(" + g.toString() + "(" + [JSON.stringify(i), f.toString(), p.toString(), u.toString()].join(",") + "));",
                        a = new Blob([e], {
                            type: "text/javascript"
                        }),
                        r = new Worker(URL.createObjectURL(a), {
                            name: "wpTestEmojiSupports"
                        });
                    return void(r.onmessage = function(e) {
                        c(n = e.data);
                        r.terminate();
                        t(n);
                    });
                } catch(e) {}
                c(n = g(i, f, p, u));
            }
            t(n);
        }).then(function(e) {
            for (var t in e)
                window.supports[t] = e[t],
                window.supports.everything = window.supports.everything && window.supports[t],
                "flag" !== t && (window.supports.everythingExceptFlag = window.supports.everythingExceptFlag && window.supports[t]);
            window.supports.everythingExceptFlag = window.supports.everythingExceptFlag && !window.supports.flag;
            window.DOMReady = false;
            window.readyCallback = function() {
                window.DOMReady = true;
            };
        }).then(function() {
            return e;
        }).then(function() {
            var e;
            window.supports.everything || (window.readyCallback(), (e = window.source || {}).concatemoji ? t(e.concatemoji) : e.wpemoji && e.twemoji && (t(e.twemoji), t(e.wpemoji)));
        });
    }
})(window, document);

// WooCommerce Settings
var wc_add_to_cart_params = {
    "ajax_url": "/wp-admin/admin-ajax.php",
    "wc_ajax_url": "/?wc-ajax=%%endpoint%%",
    "i18n_view_cart": "View cart",
    "cart_url": "https://mrquickie.com/cart/",
    "is_cart": "",
    "cart_redirect_after_add": "no"
};

var wc_cart_fragments_params = {
    "ajax_url": "/wp-admin/admin-ajax.php",
    "wc_ajax_url": "/?wc-ajax=%%endpoint%%",
    "cart_hash_key": "wc_cart_hash_315676bb92f04a91bf3182b64e718ee1",
    "fragment_name": "wc_fragments_315676bb92f04a91bf3182b64e718ee1",
    "request_timeout": "5000"
};

var woocommerce_params = {
    "ajax_url": "/wp-admin/admin-ajax.php",
    "wc_ajax_url": "/?wc-ajax=%%endpoint%%"
};

// WooCommerce Class Toggle
(function() {
    var c = document.body.className;
    c = c.replace(/woocommerce-no-js/, 'woocommerce-js');
    document.body.className = c;
})();

// Contact Form 7 Settings
var wpcf7 = {
    "api": {
        "root": "https://mrquickie.com/wp-json/",
        "namespace": "contact-form-7/v1"
    }
};

// reCAPTCHA Settings
var wpcf7_recaptcha = {
    "sitekey": "6LcC5SkqAAAAAFx8TkW4Y65IJdWiSxnyrCWKy6ym",
    "actions": {
        "homepage": "homepage",
        "contactform": "contactform"
    }
};

// Popup Message Settings
var popup_message = {
    "ajaxurl": "https://mrquickie.com/wp-admin/admin-ajax.php",
    "popup_text": "Thank you for your message. It has been sent."
};

// Muffin Theme Settings
var mfn = {
    "mobileInit": "1240",
    "parallax": "translate3d",
    "responsive": "1",
    "sidebarSticky": "",
    "lightbox": {
        "disable": false,
        "disableMobile": false,
        "title": false
    },
    "slider": {
        "blog": 3000,
        "clients": 3000,
        "offer": 3000,
        "portfolio": 3000,
        "shop": 3000,
        "slider": 3000,
        "testimonials": 3000
    },
    "livesearch": {
        "minChar": 3,
        "loadPosts": 10,
        "translation": {
            "pages": "Pages",
            "categories": "Categories",
            "portfolio": "Portfolio",
            "post": "Posts",
            "products": "Products"
        }
    },
    "accessibility": {
        "translation": {
            "headerContainer": "Header container",
            "toggleSubmenu": "Toggle submenu"
        }
    },
    "home_url": "",
    "home_url_lang": "https://mrquickie.com",
    "site_url": "https://mrquickie.com",
    "translation": {
        "success_message": "Link copied to the clipboard.",
        "error_message": "Something went wrong. Please try again later!"
    }
};

// Muffin WooCommerce Settings
var mfnwoovars = {
    "ajaxurl": "https://mrquickie.com/wp-admin/admin-ajax.php",
    "wpnonce": "3634f05372",
    "rooturl": "",
    "productthumbsover": "mfn-thumbnails-outside",
    "productthumbs": "0px",
    "mainimgmargin": "mfn-mim-0",
    "myaccountpage": "https://mrquickie.com/my-account/",
    "groupedQuantityErrori18n": "Please choose the quantity of items you wish to add to your cart…"
};

// WooCommerce Order Attribution
var wc_order_attribution = {
    "params": {
        "lifetime": 1.0e-5,
        "session": 30,
        "base64": false,
        "ajaxurl": "https://mrquickie.com/wp-admin/admin-ajax.php",
        "prefix": "wc_order_attribution_",
        "allowTracking": true
    },
    "fields": {
        "source_type": "current.typ",
        "referrer": "current_add.rf",
        "utm_campaign": "current.cmp",
        "utm_source": "current.src",
        "utm_medium": "current.mdm",
        "utm_content": "current.cnt",
        "utm_id": "current.id",
        "utm_term": "current.trm",
        "utm_source_platform": "current.plt",
        "utm_creative_format": "current.fmt",
        "utm_marketing_tactic": "current.tct",
        "session_entry": "current_add.ep",
        "session_start_time": "current_add.fd",
        "session_pages": "session.pgs",
        "session_count": "udata.vst",
        "user_agent": "udata.uag"
    }
};

// Revolution Slider Settings
window.RS_MODULES = window.RS_MODULES || {};
window.RS_MODULES.modules = window.RS_MODULES.modules || {};
window.RS_MODULES.waiting = window.RS_MODULES.waiting || [];
window.RS_MODULES.defered = true;
window.RS_MODULES.moduleWaiting = window.RS_MODULES.moduleWaiting || {};
window.RS_MODULES.type = 'compiled';

// Revolution Slider Size Setting Function
function setREVStartSize(e) {
    window.RSIW = window.RSIW === undefined ? window.innerWidth : window.RSIW;
    window.RSIH = window.RSIH === undefined ? window.innerHeight : window.RSIH;
    try {
        var pw = document.getElementById(e.c).parentNode.offsetWidth,
            newh;
        pw = pw === 0 || isNaN(pw) || (e.l == "fullwidth" || e.layout == "fullwidth") ? window.RSIW : pw;
        e.tabw = e.tabw === undefined ? 0 : parseInt(e.tabw);
        e.thumbw = e.thumbw === undefined ? 0 : parseInt(e.thumbw);
        e.tabh = e.tabh === undefined ? 0 : parseInt(e.tabh);
        e.thumbh = e.thumbh === undefined ? 0 : parseInt(e.thumbh);
        e.tabhide = e.tabhide === undefined ? 0 : parseInt(e.tabhide);
        e.thumbhide = e.thumbhide === undefined ? 0 : parseInt(e.thumbhide);
        e.mh = e.mh === undefined || e.mh == "" || e.mh === "auto" ? 0 : parseInt(e.mh, 0);
        
        if (e.layout === "fullscreen" || e.l === "fullscreen")
            newh = Math.max(e.mh, window.RSIH);
        else {
            e.gw = Array.isArray(e.gw) ? e.gw : [e.gw];
            for (var i in e.rl) 
                if (e.gw[i] === undefined || e.gw[i] === 0) 
                    e.gw[i] = e.gw[i - 1];
            
            e.gh = e.el === undefined || e.el === "" || (Array.isArray(e.el) && e.el.length == 0) ? e.gh : e.el;
            e.gh = Array.isArray(e.gh) ? e.gh : [e.gh];
            for (var i in e.rl) 
                if (e.gh[i] === undefined || e.gh[i] === 0) 
                    e.gh[i] = e.gh[i - 1];

            var nl = new Array(e.rl.length),
                ix = 0,
                sl;
            e.tabw = e.tabhide >= pw ? 0 : e.tabw;
            e.thumbw = e.thumbhide >= pw ? 0 : e.thumbw;
            e.tabh = e.tabhide >= pw ? 0 : e.tabh;
            e.thumbh = e.thumbhide >= pw ? 0 : e.thumbh;
            
            for (var i in e.rl) 
                nl[i] = e.rl[i] < window.RSIW ? 0 : e.rl[i];
            
            sl = nl[0];
            for (var i in nl) 
                if (sl > nl[i] && nl[i] > 0) {
                    sl = nl[i];
                    ix = i;
                }
            
            var m = pw > (e.gw[ix] + e.tabw + e.thumbw) ? 1 : (pw - (e.tabw + e.thumbw)) / (e.gw[ix]);
            newh = (e.gh[ix] * m) + (e.tabh + e.thumbh);
        }
        
        var el = document.getElementById(e.c);
        if (el !== null && el) 
            el.style.height = newh + "px";
        
        el = document.getElementById(e.c + "_wrapper");
        if (el !== null && el) {
            el.style.height = newh + "px";
            el.style.display = "block";
        }
    } catch(e) {
        console.log("Failure at Presize of Slider:" + e);
    }
}

// Revolution Slider Error Handler
function revslider_showDoubleJqueryError(sliderID) {
    console.log("You have some jquery.js library include that comes after the Slider Revolution files js inclusion.");
    console.log("To fix this, you can:");
    console.log("1. Set 'Module General Options' -> 'Advanced' -> 'jQuery & OutPut Filters' -> 'Put JS to Body' to on");
    console.log("2. Find the double jQuery.js inclusion and remove it");
    return "Double Included jQuery Library";
}

// Revolution Slider Initialization
window.RS_MODULES.modules["revslider81"] = {
    once: window.RS_MODULES.modules["revslider81"] !== undefined ? window.RS_MODULES.modules["revslider81"].once : undefined,
    init: function() {
        window.revapi8 = window.revapi8 === undefined || window.revapi8 === null || window.revapi8.length === 0 ? document.getElementById("rev_slider_8_1") : window.revapi8;
        
        if (window.revapi8 === null || window.revapi8 === undefined || window.revapi8.length == 0) {
            window.revapi8initTry = window.revapi8initTry === undefined ? 0 : window.revapi8initTry + 1;
            if (window.revapi8initTry < 20) 
                requestAnimationFrame(function() {
                    window.RS_MODULES.modules["revslider81"].init();
                });
            return;
        }
        
        window.revapi8 = jQuery(window.revapi8);
        
        if (window.revapi8.revolution == undefined) {
            revslider_showDoubleJqueryError("rev_slider_8_1");
            return;
        }
        
        revapi8.revolutionInit({
            revapi: "revapi8",
            DPR: "dpr",
            duration: "4000ms",
            visibilityLevels: "1240,1024,778,480",
            gridwidth: 1920,
            gridheight: 600,
            lazyType: "smart",
            perspective: 600,
            perspectiveType: "global",
            editorheight: "600,768,311,720",
            responsiveLevels: "1240,1024,778,480",
            progressBar: {
                disableProgressBar: true
            },
            navigation: {
                onHoverStop: false
            },
            viewPort: {
                global: true,
                globalDist: "-200px",
                enable: false
            },
            fallbacks: {
                allowHTML5AutoPlayOnAndroid: true
            }
        });
    }
};

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}

gtag("set", "linker", {
    "domains": ["mrquickie.com"]
});
gtag("js", new Date());
gtag("set", "developer_id.dZTNiMT", true);
gtag("config", "GT-5NPZM9M3");

window._googlesitekit = window._googlesitekit || {};
window._googlesitekit.throttledEvents = [];
window._googlesitekit.gtagEvent = (name, data) => {
    var key = JSON.stringify({
        name,
        data
    });
    if (!!window._googlesitekit.throttledEvents[key]) {
        return;
    }
    window._googlesitekit.throttledEvents[key] = true;
    setTimeout(() => {
        delete window._googlesitekit.throttledEvents[key];
    }, 5);
    gtag("event", name, {
        ...data,
        event_source: "site-kit"
    });
};

// DOM Ready Functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize search functionality
    initSearchFunctionality();
    
    // Initialize sliders
    initSliders();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize accordion functionality
    initAccordion();
    
    // Initialize form validation
    initFormValidation();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mfn-header-menu-toggle');
    const mobileMenu = document.querySelector('.mfn-header-tmpl-menu-sidebar');
    const mobileMenuClose = document.querySelector('.mfn-close-icon');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
}

// Search Functionality
function initSearchFunctionality() {
    const searchToggle = document.querySelector('.mfn-search-button');
    const searchWrapper = document.querySelector('.search_wrapper');
    const searchClose = document.querySelector('.icon_close');
    const searchInput = document.querySelector('.search_wrapper input[type="text"]');
    
    if (searchToggle && searchWrapper) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchWrapper.classList.toggle('active');
            if (searchInput) {
                searchInput.focus();
            }
        });
    }
    
    if (searchClose && searchWrapper) {
        searchClose.addEventListener('click', function(e) {
            e.preventDefault();
            searchWrapper.classList.remove('active');
        });
    }
    
    // Close search on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchWrapper && searchWrapper.classList.contains('active')) {
            searchWrapper.classList.remove('active');
        }
    });
}

// Slider Initialization
function initSliders() {
    // Content Slider
    const contentSliders = document.querySelectorAll('.content_slider');
    contentSliders.forEach(function(slider) {
        initContentSlider(slider);
    });
    
    // Shop Slider
    const shopSliders = document.querySelectorAll('.shop_slider');
    shopSliders.forEach(function(slider) {
        initShopSlider(slider);
    });
}

// Content Slider Function
function initContentSlider(slider) {
    const slides = slider.querySelectorAll('.content_slider_ul li');
    const pagination = slider.querySelector('.slider_pagination');
    let currentSlide = 0;
    
    if (slides.length <= 1) return;
    
    // Create pagination dots
    if (pagination) {
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('a');
            dot.href = '#';
            dot.className = i === 0 ? 'selected' : '';
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                goToSlide(i);
            });
            pagination.appendChild(dot);
        }
    }
    
    function goToSlide(index) {
        slides[currentSlide].style.display = 'none';
        currentSlide = index;
        slides[currentSlide].style.display = 'block';
        
        if (pagination) {
            pagination.querySelectorAll('a').forEach(function(dot, i) {
                dot.className = i === currentSlide ? 'selected' : '';
            });
        }
    }
    
    // Auto-advance slides
    setInterval(function() {
        const nextSlide = (currentSlide + 1) % slides.length;
        goToSlide(nextSlide);
    }, 5000);
}

// Shop Slider Function
function initShopSlider(slider) {
    const slideContainer = slider.querySelector('.shop_slider_ul');
    const slides = slideContainer.querySelectorAll('li');
    const navigation = slider.querySelector('.slider_navigation');
    
    if (slides.length <= 4) return; // Don't initialize if not enough slides
    
    let currentIndex = 0;
    const slidesPerView = 4;
    const slideWidth = 100 / slidesPerView;
    
    // Set initial styles
    slideContainer.style.display = 'flex';
    slideContainer.style.transition = 'transform 0.3s ease';
    slides.forEach(function(slide) {
        slide.style.minWidth = slideWidth + '%';
        slide.style.flex = '0 0 ' + slideWidth + '%';
    });
    
    if (navigation) {
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '←';
        prevBtn.className = 'slider-prev';
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        });
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '→';
        nextBtn.className = 'slider-next';
        nextBtn.addEventListener('click', function() {
            if (currentIndex < slides.length - slidesPerView) {
                currentIndex++;
                updateSliderPosition();
            }
        });
        
        navigation.appendChild(prevBtn);
        navigation.appendChild(nextBtn);
    }
    
    function updateSliderPosition() {
        const translateX = -currentIndex * slideWidth;
        slideContainer.style.transform = 'translateX(' + translateX + '%)';
    }
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const animationType = entry.target.getAttribute('data-anim-type') || 'fadeIn';
                entry.target.classList.add(animationType);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
}

// Accordion Functionality
function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(function(accordion) {
        accordion.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
}

// Utility Functions
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-lazy]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-lazy');
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Window Resize Handler
window.addEventListener('resize', debounce(function() {
    // Reinitialize sliders on resize
    initSliders();
    
    // Update any other responsive elements
    updateResponsiveElements();
}, 250));

function updateResponsiveElements() {
    // Update responsive grid layouts
    const gridElements = document.querySelectorAll('.responsive-grid');
    gridElements.forEach(function(grid) {
        // Update grid columns based on screen size
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            grid.className = grid.className.replace(/columns-\d+/, 'columns-1');
        } else if (screenWidth < 1024) {
            grid.className = grid.className.replace(/columns-\d+/, 'columns-2');
        } else {
            grid.className = grid.className.replace(/columns-\d+/, 'columns-3');
        }
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time: ' + loadTime + 'ms');
        }, 0);
    });
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

function initializeWebsite() {
    initSmoothScrolling();
    initLazyLoading();
    updateResponsiveElements();
    
    // Initialize Revolution Slider if available
    if (window.RS_MODULES && window.RS_MODULES.checkMinimal) {
        window.RS_MODULES.checkMinimal();
    }
    
    console.log('Mr Quickie website initialized successfully');
}
