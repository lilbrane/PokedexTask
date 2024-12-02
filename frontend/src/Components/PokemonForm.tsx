import React, { useEffect, useRef, useState } from 'react'
import noImageSelected from "../assets/imageNotSelected.png"
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { PokemonObjt } from '../pokemonShortObj';
import { useShakeLtoR, useHideAfterSeconds } from '../anim';
import { animated } from 'react-spring';
import axios from 'axios';
import Loader from './Loader';
import { FaCheck } from "react-icons/fa";
import Dropdown from './Dropdown';
import { IoMdCloseCircle } from "react-icons/io";
import { useInput } from "../hooks/useInput"

interface PokemonFormProps{
  pokemonNames: PokemonObjt[];
  setPokemonNames: React.Dispatch<React.SetStateAction<PokemonObjt[]>>; 
}

const descriptionMaxLength = 300;
const nameMaxLenght = 50;
const maxWeight = 1000;
const maxHeight = 10000;

const PokemonForm: React.FC<PokemonFormProps> = ({pokemonNames, setPokemonNames}) => {
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [availablePokemonTypes, setAvailablePokemonTypes] = useState([]);

  // basic variables
  const name = useInput();
  const description = useInput();
  const height = useInput();
  const weight = useInput();

  // image variables
  const [image, setImage] = useState<File | null>(null);
  const [imageHovered, setImageHovered] = useState(false);
  const [animateFile, setAnimateFile] = useState(false);
  const fileAnimated = useShakeLtoR(animateFile, setAnimateFile);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // loader variables
  const [isSaving, setIsSaving] = useState(false); // for pokemon saving loader
  const [succesfulSave, setSuccesfulSave] = useState(false);
  const hideSuccessMsgAfterSeconds = useHideAfterSeconds(setSuccesfulSave);

  // dropdown type selection
  const handleSelection = (type: string) => {
    if(!pokemonTypes.includes(type))
      setPokemonTypes([...pokemonTypes, type])
  };

  // show and hide errors
  const showDescError = () => {
    description.setVisibleError(true); 
    description.hideErrorAfterSeconds(3);
  };

  const showNameError = () => {
    name.setVisibleError(true); 
    name.hideErrorAfterSeconds(3);
  };

  const showWeightError = () => {
    weight.setVisibleError(true); 
    weight.hideErrorAfterSeconds(3);
  };

  const showHeightError = () => {
    height.setVisibleError(true); 
    height.hideErrorAfterSeconds(3);
  };


  // getting all types of pokemon from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios('http://localhost:3001/types');

        setAvailablePokemonTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);


  // on name input change check length and if its  only letters 
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (input.length <= nameMaxLenght && /^[A-Za-z]*$/.test(input) || input === "")
      name.setValue(input)
  }

  // checkc desc length
  const onDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;

    if(input.length <= descriptionMaxLength)
      description.setValue(input);
  }

  // accept only numbers
  const onNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const input = e.target.value;

    if (/^[0-9]*$/.test(input) || input === ""){
      if(type === "height"){
        height.setValue(input)
      }
      else
        weight.setValue(input)
    }
  }

  //Programmatically open the hidden file input on click of image 
  const fileSelect = () => {
    if(fileInputRef.current)
      fileInputRef.current.click(); 
  }

  // setting file logic, check type and size
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if(file){
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

  const removeType = (selectedType: string) => {
    setPokemonTypes((prevTypes) => prevTypes.filter((type) => type !== selectedType));
  }

  // on form save check if anyerrors and save in not
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let nameFieldErr, descFieldErr, weightFieldErr, heightFieldErr = false;

     // check name if blank and if pokemon with name already exists
     if (pokemonNames.some(pokemon => pokemon.name.toLowerCase() === name.value.toLowerCase())) {
      name.setError(`Pokemon with name \"${name}\" already exists`);
      nameFieldErr = true;
    }
    else if(name.value === ""){
      name.setError("Pokemon name can't be blank");
      nameFieldErr = true
    }
    else{
      name.setError("");
    }

    // description
    if(description.value === ""){
      description.setError("Description can't be blank");
      descFieldErr = true
    }
    else description.setError("")

    // weight
    if(parseInt(weight.value, 10) > maxWeight){
      weight.setError(`Weight must be less then ${maxWeight} kg`)
      weightFieldErr = true;
    }
    else if(weight.value === ""){
      weight.setError(`Height can't be blank`)
      weightFieldErr = true;
    }
    else weight.setError("")

    // height
    if(parseInt(height.value, 10) > maxHeight){
      height.setError(`Height must be less then ${maxHeight} cm`)
      heightFieldErr = true;
    }
    else if(height.value === ""){
      height.setError(`Height can't be blank`)
      heightFieldErr = true;
    }
    else height.setError("")

    if(nameFieldErr || descFieldErr || weightFieldErr || heightFieldErr || !image) {
      if(nameFieldErr){
        showNameError();
        name.setAnimateInput(true);
      }
      if(descFieldErr){
        showDescError();
        description.setAnimateInput(true);
      }
      if(weightFieldErr){
        showWeightError();
        weight.setAnimateInput(true);
      }
      if(heightFieldErr){
        showHeightError();
        height.setAnimateInput(true);
      }
      if(!image) setAnimateFile(true)

      return
    }

    // set saving so that loader is shown
    setIsSaving(true);
    uploadImageToServer();
  }

  // upload image in backend 
  const uploadImageToServer = async() => {
    const formData = new FormData();
    if(image)
      formData.append("image", image);
    else 
      return
    
    try {
      const response = await axios.post("http://localhost:3001/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // if no type is selected, set it to normal
      let pokemonTypesToSave = pokemonTypes;
      if(pokemonTypesToSave.length === 0)
        pokemonTypesToSave = ["normal"]

      const imageUrl = response.data.data.data.url
      const newPokemon = {
        name: name.value,
        description: description.value,
        weight: weight.value,
        height: height.value,
        types: pokemonTypesToSave,
        imageUrl
      }

      savePokemon(newPokemon)
      setPokemonNames([...pokemonNames, { name: name.value, url: "custom", official: false }]);
      
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert(`Error: ${err}`);
    }

    // after saving image, updating localhost and updating the array of available pokemons to search reset form and change loader to success msg
    finally{
      setIsSaving(false);
      setSuccesfulSave(true)
      hideSuccessMsgAfterSeconds(2);

      setImage(null);
      name.setValue("");
      description.setValue("");
      height.setValue("");
      weight.setValue("");
      setPokemonTypes([])
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
        <p className='userDiv col-span-7 lg:text-xl md:text-lg sm:text-base text-base my-8 w-fit mx-auto bg-primaryRed rounded-lg p-3 font-bold text-white'>Create your own pokemon</p>
        <div className='h-1 bg-primaryRed w-1/2'></div>
      </div>

      <div className='col-span-7 relative'>
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
            <form onSubmit={handleSave} className="space-y-6 w-full ">
              <div className='lg:flex block space-x-2 w-full'>

                {/* pokemon Name Input */}
                <div className="flex flex-col text-left lg:w-3/5 w-full sm:space-y-2 md:space-y-0">
                  <label htmlFor="pokemonName" className="text-lg font-medium mb-2">Pokemon name</label>
                  <div className='relative w-full'>
                    <animated.input 
                      type="text" 
                      id="pokemonName" 
                      placeholder="e.g. Electrios" 
                      className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue w-full"
                      value={name.value}
                      onChange={onNameChange}
                      style={name.animated}
                    />
                    <animated.div className="absolute w-fit bottom-2 right-2" style={name.animated}>
                      {name.value.length}/{nameMaxLenght}
                    </animated.div>
                  </div>

                  <p className={`text-red-600 font-bold ml-1 ${name.visibleError ? "opacity-100" : "opacity-0"} transition-all duration-300`}>{name.error}</p>
                </div>

                <div className='flex lg:w-2/5 w-full space-x-2'>
                  {/* Pokemon weight */}
                  <div className="flex flex-col text-left">
                    <label htmlFor="pokemonWeight" className="text-lg font-medium mb-2 flex items-center">Weight <p className='text-gray-600 text-sm lg:ml-2 ml-1'>(kg)</p></label>
                    <div className='relative w-full'>
                      <animated.input 
                        type="text" 
                        id="pokemonWeight" 
                        placeholder="e.g. 30" 
                        className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue w-full"
                        value={weight.value}
                        onChange={(e) => onNumberInputChange(e, "weight")}
                        style={weight.animated}
                      />
                    </div>
                    <p className={`text-red-600 font-bold ml-1 ${weight.visibleError ? "opacity-100" : "opacity-0"} transition-all duration-300`}>{weight.error}</p>
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
                        value={height.value}
                        onChange={(e) => onNumberInputChange(e, "height")}
                        style={height.animated}
                      />
                    </div>
                    <p className={`text-red-600 font-bold ml-1 ${height.visibleError ? "opacity-100" : "opacity-0"} transition-all duration-300`}>{height.error}</p>
                  </div>
                </div>
              </div>

              {/* pokemon types */}
              <div className='sm:flex block items-center space-x-2'>
                <div className='flex '>
                  <div className='text-lg font-medium mb-2 flex items-center mr-2' >
                    <p>Type</p>
                    <p className='text-sm text-gray-500 ml-1'>(max 3)</p>
                  </div>
                  <Dropdown items={availablePokemonTypes} onSelect={handleSelection} canOpen={pokemonTypes.length < 3}/>
                </div>

                <div className='flex space-x-2 mt-2 md:mt-0'>
                  {pokemonTypes.map((type, index) => (
                    <div key={index} className='w-fit p-2 rounded-md border-2 border-primaryBlue font-semibold relative'>
                      <p>{type}</p>
                      <div className='absolute -top-1 -right-1 text-red-700' onClick={() => removeType(type)}>
                        <IoMdCloseCircle />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pokemon descript Input */}
              <div className="flex flex-col text-left">
                <label htmlFor="pokemonDescription" className="text-lg font-medium mb-2">Pokemon description:</label>
                <div className='relative w-full'>
                  <animated.textarea
                    id="pokemonDescription"
                    placeholder="Enter description"
                    value={description.value}
                    onChange={onDescChange}
                    className="border border-gray-300 rounded-lg p-2 text-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue w-full max-h-44 min-h-10"
                    style={description.animated}
                    />
                  <animated.div className='absolute w-fit bottom-2 right-2' style={description.animated}>
                    {description.value.length}/{descriptionMaxLength}
                  </animated.div>
                </div>
                <p className={ `text-red-600 font-bold ml-1 ${description.visibleError ? "opacity-100 " : "opacity-0 "} transition-all duration-300`}>{description.error}</p>
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
    </div>
  )
}

export default PokemonForm