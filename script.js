document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const dropZoneText = document.getElementById('dropZoneText');
    const controlsPanel = document.getElementById('controlsPanel');
    
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const aspectRatioLock = document.getElementById('aspectRatioLock');
    
    const formatSelect = document.getElementById('formatSelect');
    const maxSizeInput = document.getElementById('maxSizeInput');
    
    const processBtn = document.getElementById('processBtn');
    
    const statusContainer = document.getElementById('statusContainer');
    const statusText = document.getElementById('statusText');
    const resultContainer = document.getElementById('resultContainer');
    const finalSizeText = document.getElementById('finalSize');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;
    let currentFile = null;
    let originalAspectRatio = 1;

    // Drag & Drop Handlers
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            alert('Please select a valid JPG or PNG image.');
            return;
        }

        currentFile = file;
        dropZoneText.innerHTML = `Selected: <strong>${file.name}</strong> <br><span style="font-size: 0.8em; color: var(--text-muted);">(Click or drag to change)</span>`;
        
        // Default output format based on input
        formatSelect.value = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

        // Load image to get dimensions
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                originalAspectRatio = img.width / img.height;
                
                widthInput.value = img.width;
                heightInput.value = img.height;
                
                controlsPanel.style.display = 'flex';
                statusContainer.style.display = 'none';
                resultContainer.style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Aspect Ratio Lock Logic
    widthInput.addEventListener('input', () => {
        if (aspectRatioLock.checked && originalAspectRatio) {
            heightInput.value = Math.round(widthInput.value / originalAspectRatio);
        }
    });

    heightInput.addEventListener('input', () => {
        if (aspectRatioLock.checked && originalAspectRatio) {
            widthInput.value = Math.round(heightInput.value * originalAspectRatio);
        }
    });

    // Processing Logic
    processBtn.addEventListener('click', async () => {
        if (!originalImage) return;

        processBtn.disabled = true;
        statusContainer.style.display = 'block';
        statusText.style.display = 'block';
        resultContainer.style.display = 'none';
        statusText.textContent = 'Processing...';

        const targetWidth = parseInt(widthInput.value, 10);
        const targetHeight = parseInt(heightInput.value, 10);
        const format = formatSelect.value;
        const maxKb = parseFloat(maxSizeInput.value) || 50;

        try {
            const blob = await processImage(originalImage, targetWidth, targetHeight, format, maxKb);
            
            const sizeKb = (blob.size / 1024).toFixed(2);
            finalSizeText.textContent = `${sizeKb} KB`;
            
            const url = URL.createObjectURL(blob);
            downloadBtn.href = url;
            
            // Set extension based on format
            const ext = format === 'image/png' ? 'png' : 'jpg';
            const originalName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'image';
            downloadBtn.download = `${originalName}-optimized.${ext}`;

            statusText.style.display = 'none';
            resultContainer.style.display = 'flex';
        } catch (error) {
            console.error(error);
            statusText.textContent = 'Error processing image.';
            statusText.style.color = 'var(--danger)';
        } finally {
            processBtn.disabled = false;
        }
    });

    function processImage(img, width, height, format, maxKb) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);

            if (format === 'image/png') {
                // PNG doesn't support quality parameter natively in standard HTML5 Canvas toBlob in a way that compresses.
                // We just output the PNG.
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas toBlob failed'));
                }, 'image/png');
            } else {
                // JPEG iterative optimization loop
                let quality = 1.0;
                const minQuality = 0.1;
                const step = 0.05;
                const maxBytes = maxKb * 1024;

                const attemptCompression = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Canvas toBlob failed'));
                            return;
                        }

                        if (blob.size <= maxBytes || quality <= minQuality) {
                            resolve(blob);
                        } else {
                            quality -= step;
                            attemptCompression();
                        }
                    }, 'image/jpeg', quality);
                };

                attemptCompression();
            }
        });
    }
});
