import React, { useState } from 'react'
import noImageSelected from "../imageNotSelected2.png"
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdPhoto } from "react-icons/md";

const PokemonForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(noImageSelected);

  const [nameErr, setNameErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");

  const [imageHovered, setImageHovered] = useState(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


  }
  
  return (
    <div className='grid grid-cols-2'>
      <div className='col-span-1'>
        {/* pokemon image */}
        <div className={`w-96 h-96 rounded-full border-2 border-primaryBlue p-8 items-center flex bg-white relative`}
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}>
          <img src={image} alt="Pokemon Artwork" className={`nonSelectable ${imageHovered ? "blur-md" : "blur-none"} transition-all duration-300`}/>
           <div className={`absolute inset-0 flex items-center justify-center ${imageHovered ? "opacity-100" : "opacity-0"} transition-all duration-300`}>
           <MdOutlineAddPhotoAlternate size={90} className='text-primaryRed '/>
         </div>
        </div>
      </div>

      <div className='col-span-1'>
      <MdOutlineAddPhotoAlternate size={40}/>

        <form onSubmit={handleSave} >
          <input type="text" />
          <input type="textarea" />

          <button type='submit'>Save</button>
        </form>
      </div>
    </div>
  )
}

export default PokemonForm