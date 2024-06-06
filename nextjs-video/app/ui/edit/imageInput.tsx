'use client';
import { useState } from "react"

export default function  ImageInput(){
    document.body.appendChild(document.createElement("canvas"));

    const [selectedImage, setSelectedImage] = useState("");
    const [writtenText, setWrittenText] = useState("");
    function handleImage(e: React.ChangeEvent<HTMLInputElement>): void {
        console.log(e.target.files);
        setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }

    function handleText(e: React.ChangeEvent<HTMLInputElement>): void {
        document.body.removeChild(document.querySelector("canvas"));
        setWrittenText(e.target.value);
        let img = new Image();

        img.onload = () => {
            let canva = document.createElement("canvas");
            let ctx = canva.getContext("2d");

            canva.width = img.naturalWidth;
            canva.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

            ctx.font = "bold 20px Arial";
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillText(`${writtenText}`, 60, 80);
            document.body.appendChild(canva);

            }
            img.src = `${selectedImage}`;
    } 

    return(
        <>  
        <input type="file" onChange={handleImage} />
        <img src={selectedImage} alt={selectedImage}></img>
        <input type="text" onChange={handleText} className="text-black"/>
        </>
    )
}