import { useState } from "react"

export default function imageInput(){
    const [selectedImage, setSelectedImage] = useState("");
    return(
        <>  
        <input type="file" onChange={(e) => setSelectedImage(URL.createObjectURL(e.target.files[0]))} />
        <img src={selectedImage} alt={selectedImage}></img>
        </>
    )
}