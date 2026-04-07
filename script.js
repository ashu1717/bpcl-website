/* ═══════════════════════════════════════════════════════════════════════
   BAREILLY CORPORATE LEAGUE 3 — script.js
   Multi-step form · Validation · UPI copy · Supabase submit
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Supabase Config ──────────────────────────────────────────────
  var SUPABASE_URL = 'https://ixsgbuwkchsspuqcglol.supabase.co';
  var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4c2didXdrY2hzc3B1cWNnbG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjY5OTAsImV4cCI6MjA5MTA0Mjk5MH0.yWpxzztq-E4JygwVTmf8nZJvMlMVjv2-jIWuMMUjO34';
  var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // ─── DOM References ────────────────────────────────────────────────
  var navbar       = document.getElementById('navbar');
  var hamburger    = document.getElementById('hamburger');
  var navLinks     = document.getElementById('navLinks');
  var form         = document.getElementById('registrationForm');
  var step1        = document.getElementById('step1');
  var step2        = document.getElementById('step2');
  var successState = document.getElementById('successState');
  var toStep2Btn   = document.getElementById('toStep2');
  var backBtn      = document.getElementById('backToStep1');
  var submitBtn    = document.getElementById('submitBtn');
  var progressStep2= document.getElementById('progressStep2');
  var progressFill = document.getElementById('progressLineFill');
  var copyBtn      = document.getElementById('copyUpi');
  var upiIdEl      = document.getElementById('upiId');
  var toast        = document.getElementById('toast');
  var sameAsMobile = document.getElementById('sameAsMobile');
  var mobileInput  = document.getElementById('mobile');
  var whatsappInput= document.getElementById('whatsapp');
  var screenshot   = document.getElementById('screenshot');
  var filePreview  = document.getElementById('filePreview');
  var fileContent  = document.getElementById('fileUploadContent');
  var previewImg   = document.getElementById('previewImg');
  var removeFile   = document.getElementById('removeFile');
  var shareBtn     = document.getElementById('shareBtn');

  // ─── Navbar scroll ─────────────────────────────────────────────────
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── Hamburger toggle ──────────────────────────────────────────────
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ─── WhatsApp same-as-mobile toggle ────────────────────────────────
  sameAsMobile.addEventListener('change', function () {
    whatsappInput.disabled = this.checked;
    if (this.checked) {
      whatsappInput.value = mobileInput.value;
      clearError(whatsappInput);
    }
  });
  mobileInput.addEventListener('input', function () {
    if (sameAsMobile.checked) whatsappInput.value = this.value;
  });

  // ─── Copy UPI ID ──────────────────────────────────────────────────
  copyBtn.addEventListener('click', function () {
    var text = upiIdEl.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('Copied!');
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }

  // ─── File Upload Preview ──────────────────────────────────────────
  screenshot.addEventListener('change', function () {
    var file = this.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showFieldError(screenshot, 'File size must be under 5 MB');
      this.value = '';
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      fileContent.style.display = 'none';
      filePreview.style.display = 'block';
      clearError(screenshot);
    };
    reader.readAsDataURL(file);
  });

  removeFile.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    screenshot.value = '';
    filePreview.style.display = 'none';
    fileContent.style.display = 'flex';
  });

  // ─── Validation Helpers ───────────────────────────────────────────
  function showFieldError(input, message) {
    input.classList.add('error');
    var errEl = input.closest('.field, .checkbox-field');
    if (errEl) {
      var errorDiv = errEl.querySelector('.field-error');
      if (errorDiv) { errorDiv.textContent = message; errorDiv.classList.add('show'); }
    }
  }

  function clearError(input) {
    input.classList.remove('error');
    var errEl = input.closest('.field, .checkbox-field');
    if (errEl) {
      var errorDiv = errEl.querySelector('.field-error');
      if (errorDiv) { errorDiv.textContent = ''; errorDiv.classList.remove('show'); }
    }
  }

  document.querySelectorAll('input, select, textarea').forEach(function (el) {
    el.addEventListener('input', function () { clearError(this); });
    el.addEventListener('change', function () { clearError(this); });
  });

  function validateField(input) {
    if (input.type === 'checkbox') {
      if (input.required && !input.checked) {
        showFieldError(input, 'This field is required');
        return false;
      }
      clearError(input);
      return true;
    }

    var val = input.value.trim();

    if (input.required && !val) {
      showFieldError(input, 'This field is required');
      return false;
    }

    if (val && input.pattern) {
      var re = new RegExp('^' + input.pattern + '$');
      if (!re.test(val)) {
        var name = input.id;
        if (name === 'mobile' || name === 'whatsapp') {
          showFieldError(input, 'Enter a valid 10-digit mobile number');
        } else if (name === 'pincode') {
          showFieldError(input, 'Enter a valid 6-digit PIN code');
        } else if (name === 'txnId') {
          showFieldError(input, 'Enter a valid transaction ID');
        } else {
          showFieldError(input, 'Invalid format');
        }
        return false;
      }
    }

    if (input.type === 'email' && val) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showFieldError(input, 'Enter a valid email address');
        return false;
      }
    }

    if (input.type === 'url' && val) {
      try { new URL(val); } catch (e) {
        showFieldError(input, 'Enter a valid URL');
        return false;
      }
    }

    if (input.type === 'file' && input.required && (!input.files || !input.files.length)) {
      showFieldError(input, 'Please upload your payment screenshot');
      return false;
    }

    clearError(input);
    return true;
  }

  function validateStep(stepEl) {
    var valid = true;
    var firstErr = null;

    stepEl.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (el) {
      if (el.disabled) return;
      if (!validateField(el)) {
        valid = false;
        if (!firstErr) firstErr = el;
      }
    });

    stepEl.querySelectorAll('input[type="checkbox"][required]').forEach(function (el) {
      if (!validateField(el)) {
        valid = false;
        if (!firstErr) firstErr = el;
      }
    });

    if (firstErr) {
      firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (firstErr.type !== 'checkbox' && firstErr.type !== 'file') firstErr.focus();
    }

    return valid;
  }

  // ─── Step Navigation ──────────────────────────────────────────────
  function goToStep(num) {
    step1.classList.remove('active');
    step2.classList.remove('active');
    successState.classList.remove('active');

    if (num === 1) {
      step1.classList.add('active');
      progressStep2.classList.remove('active');
      progressFill.style.width = '0';
    } else if (num === 2) {
      step2.classList.add('active');
      progressStep2.classList.add('active');
      progressFill.style.width = '100%';
    } else if (num === 3) {
      successState.classList.add('active');
      document.getElementById('progressBar').style.display = 'none';
    }

    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
  }

  toStep2Btn.addEventListener('click', function () {
    if (validateStep(step1)) goToStep(2);
  });

  backBtn.addEventListener('click', function () {
    goToStep(1);
  });

  // ─── Form Submit (Supabase) ───────────────────────────────────────
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateStep(step2)) return;

    // Disable button, show spinner
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-spinner').style.display = 'inline-block';

    try {
      // 1. Upload screenshot to Supabase Storage
      var screenshotUrl = null;
      var file = screenshot.files[0];
      if (file) {
        var ext = file.name.split('.').pop();
        var fileName = Date.now() + '_' + Math.random().toString(36).substring(2, 8) + '.' + ext;
        var filePath = 'screenshots/' + fileName;

        var { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(filePath, file, { contentType: file.type });

        if (uploadError) throw new Error('Screenshot upload failed: ' + uploadError.message);

        var { data: urlData } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(filePath);

        screenshotUrl = urlData.publicUrl;
      }

      // 2. Insert registration data into Supabase table
      var registration = {
        full_name:        document.getElementById('fullName').value.trim(),
        date_of_birth:    document.getElementById('dob').value,
        mobile:           mobileInput.value.trim(),
        whatsapp:         whatsappInput.value.trim() || mobileInput.value.trim(),
        email:            document.getElementById('email').value.trim(),
        address:          document.getElementById('address').value.trim(),
        city:             document.getElementById('city').value.trim(),
        pin_code:         document.getElementById('pincode').value.trim(),
        playing_role:     document.getElementById('role').value,
        batting_style:    document.getElementById('battingStyle').value,
        bowling_style:    document.getElementById('bowlingStyle').value,
        jersey_number:    parseInt(document.getElementById('jerseyNumber').value) || null,
        tshirt_type:      document.getElementById('tshirtType').value,
        tshirt_size:      parseInt(document.getElementById('tshirtSize').value) || null,
        lower_type:       document.getElementById('lowerType').value,
        lower_size:       parseInt(document.getElementById('lowerSize').value) || null,
        cricheroes_link:  document.getElementById('cricheroes').value.trim(),
        upi_transaction_id: document.getElementById('txnId').value.trim(),
        payment_app:      document.getElementById('paymentApp').value,
        screenshot_url:   screenshotUrl,
        payment_status:   'pending'
      };

      var { error: insertError } = await supabase
        .from('registrations')
        .insert([registration]);

      if (insertError) throw new Error('Registration failed: ' + insertError.message);

      showSuccess();
    } catch (err) {
      console.error(err);
      showToast('Error: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').style.display = 'inline';
      submitBtn.querySelector('.btn-spinner').style.display = 'none';
    }
  });

  function showSuccess() {
    var name = document.getElementById('fullName').value.trim();
    var txn  = document.getElementById('txnId').value.trim();
    document.getElementById('successSummary').innerHTML =
      '<p><strong>Player:</strong> ' + escapeHtml(name) + '</p>' +
      '<p><strong>Transaction ID:</strong> ' + escapeHtml(txn) + '</p>';
    goToStep(3);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Share Button ─────────────────────────────────────────────────
  shareBtn.addEventListener('click', function () {
    var shareData = {
      title: 'Bareilly Corporate League 3 — Player Registration',
      text: 'Register for BCL 3 — Season 2026! Pay ₹2,000 and showcase your cricket talent. 50% refundable if not selected.',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
      showToast('Link copied!');
    }
  });

  // ─── Intersection Observer (Fade-ins) ─────────────────────────────
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

  // ─── Smooth scroll for anchor links ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
