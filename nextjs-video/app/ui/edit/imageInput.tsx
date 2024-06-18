'use client';
import { useState } from "react"

export default function  ImageInput(){
    const [selectedImage, setSelectedImage] = useState("");
    const [writtenText, setWrittenText] = useState("");
    const [imageWithText, setImageWithText] = useState("");


    function handleImage(e: React.ChangeEvent<HTMLInputElement>): void {
        if (e.target.files) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    function handleText(e: React.ChangeEvent<HTMLInputElement>): void {
        setWrittenText(e.target.value);
    } 

    function addTextToImage() {
        let img = new Image();
        img.onload = () => {
            let canva = document.createElement("canvas");
            let ctx = canva.getContext("2d");
    
            if (ctx) {
                canva.width = img.naturalWidth;
                canva.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    
                ctx.font = "bold 20px Arial";
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillText(`${writtenText}`, 60, 80);
    
                setImageWithText(canva.toDataURL('image/png'));
            }
        };
        img.src = `${selectedImage}`;
    }

    async function sendImage() {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
    
            formData.append(`state1_photo`, selectedImage);
            formData.append(`state2_photo`, imageWithText);
    
            // Send the FormData to the backend
            fetch('http://localhost:3001/1234/image', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    return(
        <>  
        <input type="file" onChange={handleImage} />
        <img src={selectedImage} alt={selectedImage}></img>
        <input type="text" onChange={handleText} className="text-black"/>
        <button type="button" onClick={addTextToImage}>Add text to image</button>
        <img src={imageWithText} alt={imageWithText}></img>
        <button type="button" onClick={sendImage}>Generate video</button>
        </>

    )
}
