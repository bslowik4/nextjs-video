'use client'
import { useState, useRef, ChangeEvent, FormEvent } from 'react';

export default function Home() {
    const [photos, setPhotos] = useState<string[]>([]);
    const [text, setText] = useState<string>('');
    const [processedImages, setProcessedImages] = useState<string[]>([]);
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

    

    return (
        <div>
            <h1>Upload Image and Add Text</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Upload Photos:</label>
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                </div>
                <div>
                    <label>Text:</label>
                    <input type="text" value={text} onChange={handleTextChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <div>
                {processedImages.map((src, index) => (
                    <img key={index} src={src} alt={`Processed ${index}`} />
                ))}
            </div>
        </div>
    );
}




