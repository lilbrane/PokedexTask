import React, { useRef, useState } from 'react'
import noImageSelected from "../imageNotSelected2.png"
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdPhoto } from "react-icons/md";

interface PokemonFormProps{
  pokemonNames: string[]
}
const PokemonForm: React.FC<PokemonFormProps> = ({pokemonNames}) => {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(noImageSelected);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nameErr, setNameErr] = useState("asdas");
  const [descriptionErr, setDescriptionErr] = useState("");

  const [imageHovered, setImageHovered] = useState(false);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setName(input)
    console.log()
    if(pokemonNames.includes(input.toLowerCase())){
      setNameErr(`Pokemon with name \"${input}\" already exists`);
    }
    else{
      setNameErr("");
    }
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const fileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically open the file input
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if(file){
      console.log(file)
      const fileURL = URL.createObjectURL(file); // Create a URL for the selected file
      setImage(fileURL);
    }
  }
  
  return (
    <div className='grid grid-cols-7 pb-10 '>
      {/* title */}
      <div className='userDiv col-span-7 text-2xl my-8 w-fit mx-auto bg-primaryRed rounded-lg p-3 font-bold text-white'>
        <p>Create your own pokemon</p>
      </div>

      <div className='col-span-3'>
        {/* pokemon image */}
        <div className={`w-96 h-96 rounded-full border-2 border-primaryBlue items-center flex  relative overflow-hidden mx-auto`}
        style={{clipPath: "circle(50% at 50% 50%)", }} // so that the onMouseEnter doesnt register outside the circle (where the square corners would be)
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
          onClick={() => fileSelect()}>
          <img src={image} alt="Pokemon Artwork" className={`nonSelectable  ${imageHovered ? "blur-md" : "blur-none"} transition-all duration-300 `}
          
          />

          {/* overlay logo */}
          <div className={`absolute inset-0 flex items-center justify-center ${imageHovered ? "opacity-100" : "opacity-0"} transition-all duration-300`}>
            <MdOutlineAddPhotoAlternate size={90} className='text-primaryRed '/>
         	</div>

          {/* hidden input for file */}
          <input type="file" ref={fileInputRef} className='hidden' onChange={handleFileChange}/>
        </div>
      </div>

      <div className='col-span-4 pr-20 items-center '>
      <form onSubmit={handleSave} className="space-y-6">
        {/* pokemon Name Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="pokemonName" className="text-lg font-medium mb-2">Pokemon name</label>
          <input 
            type="text" 
            id="pokemonName" 
            placeholder="e.g. Electrios" 
            className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue"
            value={name}
            onChange={onNameChange}
          />
          <p className='text-red-600 font-bold'>{nameErr}</p>
        </div>

        {/* Pokemon descript Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="pokemonDescription" className="text-lg font-medium mb-2">Pokemon description:</label>
          <textarea
            id="pokemonDescription"
            placeholder="Enter description"
            className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button 
            type="submit" 
            className="w-1/3 bg-primaryBlue text-white py-2 rounded-lg text-lg hover:scale-105 hover:font-semibold transition-all duration-300"
          >Save
          </button>
        </div>
      </form>

      </div>
    </div>
  )
}

export default PokemonForm