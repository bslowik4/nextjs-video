'use client'
import { useState, useRef, ChangeEvent, FormEvent } from 'react';

export default function Home() {
    const [photos, setPhotos] = useState<string[]>([]);
    const [text, setText] = useState<string>('');
    const [processedImages, setProcessedImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const objectUrls = files.map(file => URL.createObjectURL(file));
        setPhotos(objectUrls);
    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const fetchBlobFromObjectURL = async (objectURL: string): Promise<File> => {
        const response = await fetch(objectURL);
        const blob = await response.blob();
        const filename = objectURL.split('/').pop() || 'file';
        return new File([blob], filename, { type: blob.type });
    };

    const drawTextOnImage = async (file: File, text: string): Promise<string> => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not found');

        const context = canvas.getContext('2d');
        const image = new Image();

        return new Promise((resolve) => {
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                if (context) {
                    context.drawImage(image, 0, 0);
                    context.font = '30px Arial';
                    context.fillStyle = 'white';
                    context.fillText(text, 50, 50); // Adjust the text position as needed
                    resolve(canvas.toDataURL('image/png'));
                }
            };

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    image.src = event.target.result as string;
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const processImages = async () => {
        const processed = await Promise.all(
            photos.map(async (objectURL) => {
                const file = await fetchBlobFromObjectURL(objectURL);
                return drawTextOnImage(file, text);
            })
        );
        setProcessedImages(processed);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await processImages();

        const formData = new FormData();

        processedImages.forEach((dataUrl, index) => {
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], `processed_photo${index}.png`, { type: mime });
            formData.append(`processed_photo`, file);
        });

        try {
            const response = await fetch('http://localhost:3001/edit/1234/image', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
            } else {
                console.error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePrevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photos.length - 1));
    };

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex < photos.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Upload Image and Add Text</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-lg font-medium text-gray-700">Upload Photos:</label>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-lg font-medium text-gray-700">Text:</label>
                <input type="text" value={text} onChange={handleTextChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black" />
            </div>
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
        </form>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        <div className="mt-8">
            {photos.length > 0 && (
                <div className="flex justify-center items-center space-x-4">
                    <button onClick={handlePrevImage} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
                    <button onClick={handleNextImage} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Next</button>
                </div>
            )}
            <div className="mt-4 flex justify-center">
                {photos.length > 0 && <img src={photos[currentIndex]} alt={`Photo ${currentIndex}`} className="max-w-full h-auto" />}
                {processedImages.length > 0 && <img src={processedImages[currentIndex]} alt={`Processed ${currentIndex}`} className="max-w-full h-auto" />}
            </div>
        </div>
    </div>
    );
}
