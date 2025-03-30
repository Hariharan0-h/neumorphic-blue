// Wait for the DOM to be fully loaded before attaching event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form controls
    const instanceDropdown = document.getElementById('instanceDropdown');
    const uinInput = document.getElementById('uinInput');
    const mrnInput = document.getElementById('mrnInput');
    
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Modal elements
    const paymentModal = document.getElementById('paymentModal');
    const photoModal = document.getElementById('photoModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Payment modal elements
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const creditCardFields = document.getElementById('creditCardFields');
    const upiFields = document.getElementById('upiFields');
    const cancelPaymentBtn = document.getElementById('cancelPayment');
    const processPaymentBtn = document.getElementById('processPayment');
    
    // Photo capture elements
    const cameraPreview = document.getElementById('camera-preview');
    const photoCanvas = document.getElementById('photo-canvas');
    const captureBtn = document.getElementById('capture-photo');
    const startCameraBtn = document.getElementById('start-camera');
    const retakePhotoBtn = document.getElementById('retake-photo');
    const savePhotoBtn = document.getElementById('savePhoto');
    const cancelPhotoBtn = document.getElementById('cancelPhoto');
    const capturePlaceholder = document.getElementById('capture-placeholder');
    const capturedImageContainer = document.getElementById('captured-image-container');
    const capturedImage = document.getElementById('captured-image');
    
    let stream = null; // Store camera stream
    
    // Handle sidebar icon clicks
    document.querySelectorAll('.sidebar-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            // Special handling for settings icon
            if (icon.id === 'settings-icon') {
                alert('Settings panel would open here');
                return;
            }
            
            // Remove active class from all icons
            document.querySelectorAll('.sidebar-icon').forEach(i => {
                i.classList.remove('active');
            });
            
            // Add active class to clicked icon
            icon.classList.add('active');
            
            // Show an alert for new icons (in a real app, you would show/hide content)
            if (['calendar-icon', 'reports-icon', 'staff-icon', 'pharmacy-icon', 'lab-icon'].includes(icon.id)) {
                const iconName = icon.querySelector('.icon-label').textContent;
                alert(`${iconName} module would open here`);
            }
            
            console.log(`Clicked on ${icon.id}`);
        });
    });
    
    // Handle instance dropdown change
    instanceDropdown.addEventListener('change', function() {
        if (this.value === 'review') {
            // If "Review" is selected, enable the input fields
            uinInput.disabled = false;
            mrnInput.disabled = false;
        } else {
            // Otherwise, disable the input fields
            uinInput.disabled = true;
            mrnInput.disabled = true;
            // Clear any values
            uinInput.value = '';
            mrnInput.value = '';
        }
    });
    
    // Tab click functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Log tab click for debugging
            console.log('Tab clicked:', tab.getAttribute('data-tab'));
            
            // Remove active class from all tabs and tab contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab
            tab.classList.add('active');
            
            // Show the corresponding content
            const tabContentId = tab.getAttribute('data-tab');
            const tabContent = document.getElementById(tabContentId);
            
            if (tabContent) {
                tabContent.classList.add('active');
            } else {
                console.error('Tab content not found:', tabContentId);
            }
        });
    });
    
    // Form field validation
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        control.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = '#e53e3e';
            } else {
                this.style.borderColor = '';
            }
        });
    });
    
    // Handle form action buttons
    const actionButtons = document.querySelectorAll('.form-actions .btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-secondary') && this.textContent === 'Back') {
                // Find current active tab
                const activeTab = document.querySelector('.tab.active');
                const tabs = Array.from(document.querySelectorAll('.tab'));
                const currentIndex = tabs.indexOf(activeTab);
                
                // If there's a previous tab, click it
                if (currentIndex > 0) {
                    tabs[currentIndex - 1].click();
                }
            } else if (this.classList.contains('btn-primary') && this.textContent.includes('Continue')) {
                // Find current active tab
                const activeTab = document.querySelector('.tab.active');
                const tabs = Array.from(document.querySelectorAll('.tab'));
                const currentIndex = tabs.indexOf(activeTab);
                
                // If there's a next tab, click it
                if (currentIndex < tabs.length - 1) {
                    tabs[currentIndex + 1].click();
                }
            } else if (this.textContent === 'Save Patient Record') {
                alert('Patient record would be saved here');
            } else if (this.textContent === 'Payment') {
                // Show payment modal
                paymentModal.style.display = 'block';
            }
        });
    });
    
    // Add "Take Photo" button to Additional Info tab
    // Function to add the photo button in the first row and center it
function addPhotoButton() {
    // Find the additional-info tab
    const additionalInfoTab = document.getElementById('additional-info');
    
    // Create a new form row specifically for the photo at the top
    const photoRow = document.createElement('div');
    photoRow.className = 'form-row';
    photoRow.style.justifyContent = 'center';
    photoRow.style.marginBottom = '25px';
    
    // Create photo button group
    const photoGroup = document.createElement('div');
    photoGroup.className = 'form-group';
    photoGroup.style.maxWidth = '300px'; // Limit width for centering
    photoGroup.style.textAlign = 'center';
    photoGroup.innerHTML = `
        <label style="text-align: center; display: block; margin-bottom: 5px;">Patient Photo</label>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div id="photo-preview" style="width: 130px; height: 130px; border: 1px dashed #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; background-color: #f9f9f9; margin: 0 auto;">
                <i class="fas fa-user" style="font-size: 60px; color: #ddd;"></i>
            </div>
            <button type="button" id="open-camera" class="btn btn-secondary" style="margin-top: 5px;">
                <i class="fas fa-camera"></i> Take Photo
            </button>
        </div>
    `;
    
    // Add the photo group to the new row
    photoRow.appendChild(photoGroup);
    
    // Get the h3 title element in the additional-info tab
    const titleElement = additionalInfoTab.querySelector('h3');
    
    // Insert the new photo row after the title
    titleElement.after(photoRow);
    
    // Add event listener to the button
    document.getElementById('open-camera').addEventListener('click', function() {
        document.getElementById('photoModal').style.display = 'block';
    });
}
    
    // Call the function to add the photo button
    addPhotoButton();
    
    // Modal functionality
    
    // Close modals when clicking on the X or Cancel buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            paymentModal.style.display = 'none';
            photoModal.style.display = 'none';
            stopCamera(); // Stop camera when closing photo modal
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
        if (event.target === photoModal) {
            photoModal.style.display = 'none';
            stopCamera(); // Stop camera when closing photo modal
        }
    });
    
    // Cancel buttons for modals
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', function() {
            paymentModal.style.display = 'none';
        });
    }
    
    if (cancelPhotoBtn) {
        cancelPhotoBtn.addEventListener('click', function() {
            photoModal.style.display = 'none';
            stopCamera(); // Stop camera when canceling
        });
    }
    
    // Process Payment button
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', function() {
            const amount = document.getElementById('paymentAmount').value;
            const method = document.getElementById('paymentMethod').value;
            
            alert(`Payment of ${amount} processed successfully via ${method}!`);
            paymentModal.style.display = 'none';
        });
    }
    
    // Toggle payment method fields
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function() {
            if (this.value === 'credit' || this.value === 'debit') {
                creditCardFields.style.display = 'block';
                upiFields.style.display = 'none';
            } else if (this.value === 'upi') {
                creditCardFields.style.display = 'none';
                upiFields.style.display = 'block';
            } else {
                creditCardFields.style.display = 'none';
                upiFields.style.display = 'none';
            }
        });
    }
    
    // Camera functionality
    
    // Start camera
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', function() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(mediaStream) {
                        stream = mediaStream;
                        cameraPreview.srcObject = mediaStream;
                        cameraPreview.style.display = 'block';
                        capturePlaceholder.style.display = 'none';
                        captureBtn.disabled = false;
                        startCameraBtn.disabled = true;
                    })
                    .catch(function(error) {
                        console.error('Error accessing camera:', error);
                        alert('Could not access camera. Please ensure camera permissions are enabled.');
                    });
            } else {
                alert('Your browser does not support camera access.');
            }
        });
    }
    
    // Capture photo
    if (captureBtn) {
        captureBtn.addEventListener('click', function() {
            if (stream) {
                // Set canvas dimensions to match video
                photoCanvas.width = cameraPreview.videoWidth;
                photoCanvas.height = cameraPreview.videoHeight;
                
                // Draw video frame to canvas
                const context = photoCanvas.getContext('2d');
                context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);
                
                // Get image from canvas
                const imageDataUrl = photoCanvas.toDataURL('image/png');
                
                // Display captured image
                capturedImage.src = imageDataUrl;
                cameraPreview.style.display = 'none';
                capturedImageContainer.style.display = 'block';
                
                // Update buttons
                captureBtn.style.display = 'none';
                retakePhotoBtn.style.display = 'inline-block';
                savePhotoBtn.disabled = false;
            }
        });
    }
    
    // Retake photo
    if (retakePhotoBtn) {
        retakePhotoBtn.addEventListener('click', function() {
            // Show video preview again
            cameraPreview.style.display = 'block';
            capturedImageContainer.style.display = 'none';
            
            // Update buttons
            captureBtn.style.display = 'inline-block';
            retakePhotoBtn.style.display = 'none';
            savePhotoBtn.disabled = true;
        });
    }
    
    // Save photo
    if (savePhotoBtn) {
        savePhotoBtn.addEventListener('click', function() {
            // Get the captured image data
            const imageDataUrl = capturedImage.src;
            
            // Update the photo preview in the form
            const photoPreview = document.getElementById('photo-preview');
            photoPreview.innerHTML = '';
            
            const previewImg = document.createElement('img');
            previewImg.src = imageDataUrl;
            previewImg.style.width = '100%';
            previewImg.style.height = '100%';
            previewImg.style.objectFit = 'cover';
            previewImg.style.borderRadius = '4px';
            
            photoPreview.appendChild(previewImg);
            
            // Close the modal and stop the camera
            photoModal.style.display = 'none';
            stopCamera();
        });
    }
    
    // Helper function to stop the camera
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
            stream = null;
            
            // Reset UI elements
            cameraPreview.srcObject = null;
            cameraPreview.style.display = 'none';
            capturePlaceholder.style.display = 'flex';
            capturedImageContainer.style.display = 'none';
            
            // Reset buttons
            captureBtn.style.display = 'inline-block';
            captureBtn.disabled = true;
            retakePhotoBtn.style.display = 'none';
            startCameraBtn.disabled = false;
            savePhotoBtn.disabled = true;
        }
    }
});