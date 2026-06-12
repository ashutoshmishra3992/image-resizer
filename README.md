# Offline Image Resizer

A fast, single-page, client-side web application that enables you to easily upload, resize, and compress images directly in your browser. Since all processing happens on your device, this tool is entirely offline and guarantees total privacy—your images are never uploaded to any server.

## Features

- **Local Processing**: All image processing (resizing and compression) happens completely within your browser.
- **Format Support**: Works seamlessly with JPEG and PNG images.
- **Interactive UI**: Supports an intuitive drag-and-drop interface for easy image uploads.
- **Aspect Ratio Locking**: Resize images confidently while maintaining their original proportions.
- **Target File Size Compression**: Features an iterative compression algorithm for JPEGs to help you hit a specific target file size (in KB).
- **Direct Download**: Instantly download your resized and compressed images.

## Technology Stack

Built using modern web standards without any heavy frameworks or backend dependencies:
- **HTML5**
- **Vanilla CSS3**
- **Vanilla JavaScript**

## Getting Started

Because there is no backend server required, getting started is as simple as opening a file:

1. Clone the repository:
   ```bash
   git clone https://github.com/ashutoshmishra3992/image-resizer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd image-resizer
   ```
3. Open `index.html` in your favorite modern web browser.

Alternatively, you can visit the hosted version (if available) to use the app directly.

## How to Use

1. **Upload**: Drag and drop an image into the designated area or click to select a file from your device.
2. **Resize**: Enter your desired width or height. Toggle the lock icon to maintain or break the original aspect ratio.
3. **Compress (JPEG only)**: Enter a target file size in KB. The app will iteratively compress the image to get as close to this target as possible without going over.
4. **Download**: Click the download button to save your processed image.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
