// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// ENROLLMENT SYSTEM - Global enrolled courses array
let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];

// Add course to enrollment when clicking Enroll Now
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('enroll-btn') || e.target.closest('.enroll-btn')) {
        e.preventDefault();
        const courseCard = e.target.closest('.course-detailed, .course-card');
        const courseTitle = courseCard.querySelector('h3').textContent;
        const coursePrice = courseCard.querySelector('.price').textContent;
        
        // Add to enrolled courses
        const course = {
            id: Date.now(),
            title: courseTitle,
            price: coursePrice,
            date: new Date().toLocaleDateString()
        };
        
        enrolledCourses.unshift(course);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        
        // Show success animation
        showEnrollmentModal(course);
        
        // Update button
        const btn = e.target.closest('.enroll-btn');
        btn.textContent = 'Enrolled ✓';
        btn.style.background = '#6b7280';
        btn.disabled = true;
    }
});

// Enrollment success modal
function showEnrollmentModal(course) {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-success">
                <div class="success-icon">✓</div>
                <h3>Successfully Enrolled!</h3>
                <p>"${course.title}" has been added to your account</p>
                <div class="course-preview">
                    <div class="course-icon">📚</div>
                    <div>
                        <strong>${course.title}</strong><br>
                        <span>Added: ${course.date}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="this.closest('.enrollment-modal').remove()">Continue Shopping</button>
                    <a href="billing.html" class="btn-secondary">View in Billing</a>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto remove after 5 seconds
    setTimeout(() => modal.remove(), 5000);
}

// Load enrolled courses on billing page
if (window.location.pathname.includes('billing.html')) {
    loadBillingData();
}

function loadBillingData() {
    const subscriptionsGrid = document.querySelector('.subscriptions-grid');
    const totalSpentEl = document.querySelector('.stat-number');
    
    if (enrolledCourses.length === 0) {
        subscriptionsGrid.innerHTML = `
            <div class="no-subscriptions">
                <i class="fas fa-inbox"></i>
                <h4>No Active Subscriptions</h4>
                <p>Enroll in courses to see them here</p>
                <a href="courses.html" class="btn-primary">Browse Courses</a>
            </div>
        `;
        return;
    }
    
    // Calculate total spent
    const totalSpent = enrolledCourses.reduce((sum, course) => {
        const price = parseFloat(course.price.replace('$', ''));
        return sum + price;
    }, 0);
    
    totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
    document.querySelector('.stat-number:nth-of-type(2)').textContent = enrolledCourses.length;
    
    // Populate subscriptions
    subscriptionsGrid.innerHTML = enrolledCourses.map(course => `
        <div class="subscription-item">
            <div class="subscription-header">
                <h4>${course.title}</h4>
                <span class="status active">Active</span>
            </div>
            <div class="subscription-details">
                <div class="price-row">
                    <span>${course.price}</span>
                    <span>/month</span>
                </div>
                <div class="next-payment">
                    <i class="fas fa-calendar-alt"></i>
                    Next: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}
                </div>
            </div>
            <div class="subscription-actions">
                <button class="btn-small secondary" onclick="cancelSubscription(${course.id})">Cancel</button>
            </div>
        </div>
    `).join('');
}

// Cancel subscription
function cancelSubscription(courseId) {
    if (confirm('Are you sure you want to cancel this subscription?')) {
        enrolledCourses = enrolledCourses.filter(course => course.id !== courseId);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        loadBillingData();
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Contact form
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});