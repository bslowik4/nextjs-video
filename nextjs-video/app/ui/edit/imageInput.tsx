'use client';
import { useState } from "react"

export default function  ImageInput(){
    const [selectedImage, setSelectedImage] = useState("");
    function handleChange(e) {
        console.log(e.target.files);
        setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
    
    return(
        <>  
        <input type="file" onChange={handleChange} />
        <img src={selectedImage} alt={selectedImage}></img>
        </>
    )
}