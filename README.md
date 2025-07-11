
# ![banner](https://github.com/user-attachments/assets/a7183020-1322-4b36-ab01-3ae419455d7e)


[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13.0+-blueviolet.svg)](https://nextjs.org/)
[![Offline Capable](https://img.shields.io/badge/Offline-100%25-success.svg)](#features)

One time I needed to convert a sensitive document into PDF, I had to go through tons of trouble just to find offline software that does it well while ensuring these files aren't seen by others. That is why I built OfflineUtils (with Trae), a powerful collection of completely local, offline-capable utility tools for file conversion and manipulation. 

Built with Next.js and designed to prioritize privacy by performing all operations client-side.

## Features

- 🔒 **100% Offline Operation** - All processing happens locally in your browser
- 🖼️ **Image Conversion** - Convert between various image formats (JPG, PNG, WebP)
- 📄 **PDF Tools** - Convert images to PDF and merge multiple PDFs
- 📸 **Metadata Viewer/Editor** - View and edit image EXIF data
- 🗺️ **Location Data Management** - View and clean location data from images
- 🎨 **Modern UI** - Beautiful, responsive interface with dark mode

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone [https://github.com/Peteryhs/OfflineUtils]
cd offline-utils
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Image Conversion
- Upload images through the drag-and-drop interface
- Select your desired output format (JPG, PNG, WebP)
- Adjust quality settings as needed
- Download the converted file

### PDF Tools
- Convert single or multiple images to PDF
- Merge multiple PDF files
- Adjust page sizes and margins
- Maintain image quality during conversion

### Metadata Management
- View comprehensive EXIF data
- Edit metadata fields
- Remove privacy-sensitive information
- Save changes back to images

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Components**: Custom components with Tailwind CSS
- **PDF Processing**: pdf-lib
- **Image Processing**: Sharp
- **Animations**: Framer Motion

## Privacy

All operations are performed entirely in the browser. No data is ever uploaded to any server, making this tool suitable for sensitive documents and images.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- pdf-lib for PDF manipulation capabilities
- Sharp for image processing
