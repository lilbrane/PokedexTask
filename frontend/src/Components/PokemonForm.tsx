import React, { useRef, useState } from 'react'
import noImageSelected from "../imageNotSelected2.png"
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { PokemonObjt } from '../pokemonShortObj';
import { useShakeLtoR, useHideAfterSeconds } from '../anim';
import { animated } from 'react-spring';
import axios from 'axios';
import Loader from './Loader';
import { FaCheck } from "react-icons/fa";

interface PokemonFormProps{
  pokemonNames: PokemonObjt[];
  setPokemonNames: React.Dispatch<React.SetStateAction<PokemonObjt[]>>; 
}

const descriptionMaxLength = 300;
const nameMaxLenght = 50;
const maxWeight = 1000;
const maxHeight = 10000;

const PokemonForm: React.FC<PokemonFormProps> = ({pokemonNames, setPokemonNames}) => {
  // name variables
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [animateNameInput, setAnimateNameInput] = useState(false);
  const nameAnimated = useShakeLtoR(animateNameInput, setAnimateNameInput);
  const [visibleNameErr, setVisibleNameErr] = useState(false);
  const hideNameErrAfterSeconds = useHideAfterSeconds(setVisibleNameErr);

  // description variables
  const [description, setDescription] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [animateDescInput, setAnimateDescInput] = useState(false);
  const descAnimated = useShakeLtoR(animateDescInput, setAnimateDescInput);
  const [visibleDescErr, setVisibleDescErr] = useState(false);
  const hideDescErrAfterSeconds = useHideAfterSeconds(setVisibleDescErr);

  // image variables
  const [image, setImage] = useState<File | null>(null);

  const [imageHovered, setImageHovered] = useState(false);
  const [animateFile, setAnimateFile] = useState(false);
  const fileAnimated = useShakeLtoR(animateFile, setAnimateFile);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // height variables
  const [height, setHeight] = useState("");
  const [heightErr, setHeightErr] = useState("");
  const [animateHeightInput, setAnimateHeightInput] = useState(false);
  const heightAnimated = useShakeLtoR(animateHeightInput, setAnimateHeightInput);
  const [visibleHeightErr, setVisibleHeightErr] = useState(false);
  const hideHeightErrAfterSeconds = useHideAfterSeconds(setVisibleHeightErr);

  // weight variables
  const [weight, setWeight] = useState("");
  const [weightErr, setWeightErr] = useState("");
  const [animateWeightInput, setAnimateWeightInput] = useState(false);
  const weightAnimated = useShakeLtoR(animateWeightInput, setAnimateWeightInput);
  const [visibleWeightErr, setVisibleWeightErr] = useState(false);
  const hideWeightErrAfterSeconds = useHideAfterSeconds(setVisibleWeightErr);

  const [isSaving, setIsSaving] = useState(false); // for pokemon saving loader
  const [succesfulSave, setSuccesfulSave] = useState(false);
  const hideSuccessMsgAfterSeconds = useHideAfterSeconds(setSuccesfulSave);

  // show and hide error
  const showDescError = () => {
    setVisibleDescErr(true); 
    hideDescErrAfterSeconds(3);
  };

  const showNameError = () => {
    setVisibleNameErr(true); 
    hideNameErrAfterSeconds(3);
  };

  const showWeightError = () => {
    setVisibleWeightErr(true); 
    hideWeightErrAfterSeconds(3);
  };

  const showHeightError = () => {
    setVisibleHeightErr(true); 
    hideHeightErrAfterSeconds(3);
  };


  // on name input change check length and if its  only letters 
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (input.length <= nameMaxLenght && /^[A-Za-z]*$/.test(input) || input === "")
      setName(input)
  }

  // checkc desc length
  const onDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;

    if(input.length <= descriptionMaxLength)
      setDescription(input);
  }

  // accept only numbers
  const onNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const input = e.target.value;

    if (/^[0-9]*$/.test(input) || input === ""){
      if(type === "height"){
        setHeight(input)
      }
      else
        setWeight(input)
    }
  }

  //Programmatically open the hidden file input on click of image 
  const fileSelect = () => {
    if(fileInputRef.current)
      fileInputRef.current.click(); 
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];


    if(file){
      console.log(file.size / (1024 * 1024))

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg"];

      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPG, JPEG, and SVG files are allowed.");
        return;
      }
      else if (file.size / (1024 * 1024) > 1) {
        alert("Image must be smaller then 1Mb");
        return;
      }

      setImage(file);
    }
  }

  // on form save check if anyerrors and save in not
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let nameFieldErr, descFieldErr, weightFieldErr, heightFieldErr = false;

     // check name 
     if (pokemonNames.some(pokemon => pokemon.name.toLowerCase() === name.toLowerCase())) {
      setNameErr(`Pokemon with name \"${name}\" already exists`);
      nameFieldErr = true;
    }
    else if(name === ""){
      setNameErr("Pokemon name can't be blank");
      nameFieldErr = true
    }
    else{
      setNameErr("");
    }

    // description
    if(description === ""){
      setDescriptionErr("Description can't be blank");
      descFieldErr = true
    }
    else setDescriptionErr("")

    // weight
    if(parseInt(weight, 10) > maxWeight){
      setWeightErr(`Weight must be less then ${maxWeight} kg`)
      weightFieldErr = true;
    }
    else if(weight === ""){
      setWeightErr(`Height can't be blank`)
      weightFieldErr = true;
    }
    else setWeightErr("")

    // height
    if(parseInt(height, 10) > maxHeight){
      setHeightErr(`Height must be less then ${maxHeight} cm`)
      heightFieldErr = true;
    }
    else if(height === ""){
      setHeightErr(`Height can't be blank`)
      heightFieldErr = true;
    }
    else setHeightErr("")


    if(nameFieldErr || descFieldErr || weightFieldErr || heightFieldErr || !image) {
      if(nameFieldErr){
        showNameError();
        setAnimateNameInput(true);
      }
      if(descFieldErr){
        showDescError();
        setAnimateDescInput(true);
      }
      if(weightFieldErr){
        showWeightError();
        setAnimateWeightInput(true);
      }
      if(heightFieldErr){
        showHeightError();
        setAnimateHeightInput(true);
      }
      if(!image) setAnimateFile(true)

      return
    }

    setIsSaving(true);
    uploadImageToServer();
  }

  const uploadImageToServer = async() => {
    const formData = new FormData();
    if(image)
      formData.append("image", image);
    else 
      return
    
      console.log(formData)
    try {
      const response = await axios.post("http://localhost:3001/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data.data.data.url
      const newPokemon = {
        name,
        description,
        weight,
        height,
        imageUrl
      }

      savePokemon(newPokemon)
      setPokemonNames([...pokemonNames, { name: name, url: "custom", official: false }]);
      
      console.log("Image uploaded successfully:", imageUrl);
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert(`Error: ${err}`);
    }
    finally{
      setIsSaving(false);
      setSuccesfulSave(true)
      hideSuccessMsgAfterSeconds(2);

      setImage(null);
      setName("");
      setDescription("");
      setWeight("");
      setHeight("");
    }
  };

  const savePokemon = (newPokemon: any) => {
    let pokemons: any[] = [];

    // getting the saved pokemon array
    const savedPokemons = localStorage.getItem("pokemons");
    if(savedPokemons)
      pokemons = JSON.parse(savedPokemons);

    // pushing to saved pokemon array
    pokemons.push(newPokemon);

    // updated array back to localstorage
    localStorage.setItem("pokemons", JSON.stringify(pokemons));
  }
  
  
  return (
    <div className='grid grid-cols-7 pb-10 '>
      {/* title */}
      <div className='col-span-7 flex items-center'>
        <div className='h-1 bg-primaryRed w-1/2'></div>
        <p className='userDiv col-span-7 lg:text-2xl md:text-xl sm:text-lg text-base my-8 w-fit mx-auto bg-primaryRed rounded-lg p-3 font-bold text-white'>Create your own pokemon</p>
        <div className='h-1 bg-primaryRed w-1/2'></div>
      </div>

      <div className='col-span-7'>
        <div className={`col-span-7 grid grid-cols-7 ${(isSaving || succesfulSave) ? "blur-md" : "blur-none"} transition-all duration-300`}>
          <div className='md:col-span-3 col-span-7 '>

            {/* pokemon image */}
            <animated.div className={`lg:w-96 lg:h-96 md:w-72 md:h-72 sm:w-52 sm:h-52 w-40 h-40 rounded-full border-2 border-primaryBlue items-center flex  relative overflow-hidden mx-auto`}
              style={{clipPath: "circle(50% at 50% 50%)", ...fileAnimated}} // so that the onMouseEnter doesnt register outside the circle (where the square corners would be)
              
              onMouseEnter={() => setImageHovered(true)}
              onMouseLeave={() => setImageHovered(false)}
              onClick={() => fileSelect()}>
              <img src={image ? URL.createObjectURL(image) : noImageSelected} alt="Pokemon Artwork" className={`nonSelectable  ${imageHovered ? "blur-md" : "blur-none"} transition-all duration-300 `}/>

              {/* overlay logo */}
              <div className={`absolute inset-0 flex items-center justify-center ${imageHovered ? "opacity-100" : "opacity-0"} transition-all duration-300`}>
                <MdOutlineAddPhotoAlternate size={90} className='text-primaryRed '/>
              </div>

              {/* hidden input for file */}
              <input type="file" ref={fileInputRef} className='hidden' onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg, image/svg+xml"/>
            </animated.div>
          </div>

          <div className='md:col-span-4 col-span-7 md:pr-20 pr-10 pl-10 items-center '>
            <form onSubmit={handleSave} className="space-y-6">
              <div className='md:flex block space-x-2'>

                {/* pokemon Name Input */}
                <div className="flex flex-col text-left md:w-3/5 w-full sm:space-y-2 md:space-y-0">
                  <label htmlFor="pokemonName" className="text-lg font-medium mb-2">Pokemon name</label>
                  <div className='relative w-full'>
                    <animated.input 
                      type="text" 
                      id="pokemonName" 
                      placeholder="e.g. Electrios" 
                      className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue w-full"
                      value={name}
                      onChange={onNameChange}
                      style={nameAnimated}
                    />
                    <animated.div className="absolute w-fit bottom-2 right-2" style={nameAnimated}>
                      {name.length}/{nameMaxLenght}
                    </animated.div>
                  </div>

                  <p className={`text-red-600 font-bold ml-1 ${visibleNameErr ? "opacity-100" : "opacity-0"} transition-all duration-300`}>{nameErr}</p>
                </div>

                <div className='flex w-2/5 space-x-2'>
                  {/* Pokemon weight */}
                  <div className="flex flex-col text-left">
                    <label htmlFor="pokemonWeight" className="text-lg font-medium mb-2 flex items-center">Weight <p className='text-gray-600 text-sm lg:ml-2 ml-1'>(kg)</p></label>
                    <div className='relative w-full'>
                      <animated.input 
                        type="text" 
                        id="pokemonWeight" 
                        placeholder="e.g. 30" 
                        className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue w-full"
                        value={weight}
                        onChange={(e) => onNumberInputChange(e, "weight")}
                        style={weightAnimated}
                      />
                    </div>
                    <p className={`text-red-600 font-bold ml-1 ${visibleWeightErr ? "opacity-100" : "opacity-0"} transition-all duration-300`}>{weightErr}</p>
                  </div>

                  {/* Pokemon height */}
                  <div className="flex flex-col text-left">
                    <label htmlFor="pokemonHeight" className="text-lg font-medium mb-2 flex items-center">Height <p className='text-gray-600 text-sm lg:ml-2 ml-1'>(cm)</p></label>
                    <div className='relative w-full'>
                      <animated.input 
                        type="text" 
                        id="pokemonHeight" 
                        placeholder="e.g. 10" 
                        className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue w-full"
                        value={height}
                        onChange={(e) => onNumberInputChange(e, "height")}
                        style={heightAnimated}
                      />
                    </div>
                    <p className={`text-red-600 font-bold ml-1 ${visibleHeightErr ? "opacity-100" : "opacity-0"} transition-all duration-300`}>{heightErr}</p>
                  </div>
                </div>
              </div>
              
              {/* Pokemon descript Input */}
              <div className="flex flex-col text-left">
                <label htmlFor="pokemonDescription" className="text-lg font-medium mb-2">Pokemon description:</label>
                <div className='relative w-full'>
                  <animated.textarea
                    id="pokemonDescription"
                    placeholder="Enter description"
                    value={description}
                    onChange={onDescChange}
                    className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue w-full max-h-44 min-h-10"
                    style={descAnimated}
                    />
                  <animated.div className='absolute w-fit bottom-2 right-2' style={descAnimated}>
                    {description.length}/{descriptionMaxLength}
                  </animated.div>
                </div>
                <p className={ `text-red-600 font-bold ml-1 ${visibleDescErr ? "opacity-100 " : "opacity-0 "} transition-all duration-300`}>{descriptionErr}</p>
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

        {/* LOADER */}
        {(isSaving || succesfulSave) &&
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className='bg-primaryRed p-4 rounded-xl text-white font-semibold '>
              {!succesfulSave 
              ?
                <div className='flex items-center space-x-4'>
                  <p>Pokemon is saving</p>
                  <Loader />
                </div>
              :
              <div className='flex items-center space-x-4'>
                <p>Pokemon successfully saved</p>
                <FaCheck color='green' size={30} />
              </div>
              }
              

            </div>

          </div>
        }
        
      </div>
        

        
        {/* {isSaving && 
        <div className='absolute '>pokemon is saving</div>
        } */}
      
    </div>
  )
}

export default PokemonForm