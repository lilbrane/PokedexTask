import React, { useEffect, useState } from 'react'
import { PokemonObjt } from '../pokemonShortObj'
import Dropdown from './Dropdown';
import { IoCaretForwardOutline, IoCaretBackOutline  } from "react-icons/io5";

interface PokemonListParams{
    availablePokemon: PokemonObjt[];
    setAvailablePokemon: React.Dispatch<React.SetStateAction<PokemonObjt[]>>;
    choosePokemon: (choosenPokemon: PokemonObjt) => void;  // Function type
}

const pokemonSortOptions = ["A-Z", "Z-A"];
const rowsPerPageOption = ["5", "10", "15", "20", "30"];

const PokemonList: React.FC<PokemonListParams> = ({availablePokemon, setAvailablePokemon, choosePokemon}) => {
    const [numCols, setNumCols] = useState(1);
    const [numOfRowsPerPage, setNumOfRowsPerPage] = useState(5);
    const [currPage, setCurrPage] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState(numOfRowsPerPage * numCols);

      // Function to get the number of columns and set items per page
      const updateNumCols = (rows: number) => {
        const gridElement = document.querySelector(".grid");
        if (gridElement) {
            const computedStyle = getComputedStyle(gridElement);
            const cols = computedStyle.gridTemplateColumns.split(" ").length;
            setNumCols(cols);
            const newItemsPerPage = cols * rows;
            setItemsPerPage(newItemsPerPage);

            const maxPages = Math.ceil(availablePokemon.length / newItemsPerPage);
            if (currPage >= maxPages) {
                setCurrPage(maxPages - 1);
            }
        }
    };


    //  initial sort call on page load
    useEffect(() => {
        changeSort("A-Z");

        const handleResize = () => updateNumCols(numOfRowsPerPage);

         // on initial render and on window resize
         handleResize();
         window.addEventListener("resize", handleResize);
 
         return () => {
             window.removeEventListener("resize", handleResize);
         };
    }, [numOfRowsPerPage]);

    // when changing sort from dropdown
    const changeSort = (value: string) => {
        if(value === "A-Z")
            setAvailablePokemon([...availablePokemon].sort((a,b) => a.name.localeCompare(b.name)))
        else
            setAvailablePokemon([...availablePokemon].sort((a,b) => b.name.localeCompare(a.name)))
    }
    
    const changeRowsPerPage = (value: string) => {
        setNumOfRowsPerPage(parseInt(value));
        setItemsPerPage(numCols*parseInt(value));

        setCurrPage(0);

        updateNumCols(numOfRowsPerPage);
    }

    const prevPage = () => {
        let newPageNum = currPage - 1;
        if(newPageNum < 0) newPageNum = 0

        setCurrPage(newPageNum);
    }

    const nextPage = () => {
        let newPageNum = currPage + 1;

        if(newPageNum > totalPageNumber()-1) newPageNum = currPage;

        setCurrPage(newPageNum);

    }

    // array of pokemon to show on current page
    const pokemonArrayToShow = () => {
        let firstIdx = currPage*itemsPerPage;

        let lastIdx = firstIdx+itemsPerPage;
        if(lastIdx > availablePokemon.length) 
            lastIdx = availablePokemon.length-1;

        // if first idex is above the number of total pokemon return empty array cuz we shown all
        if(firstIdx > availablePokemon.length) 
            return [];

        return availablePokemon.slice(firstIdx, lastIdx);

    } 

    const totalPageNumber = () => {
        let allPages = Math.floor(availablePokemon.length / itemsPerPage)
        if(Math.floor(availablePokemon.length / itemsPerPage) < availablePokemon.length / itemsPerPage)
            allPages++;
        return allPages;
    } 

  return (
    <div className='w-4/5 mx-auto'>
        {/* top info and filter */}
        <div className='flex items-center justify-between pr-10 mb-4'>
            <p className='text-xl font-semibold bg-primaryBlue bg-opacity-80 p-2 rounded-lg text-primaryWhite'>All pokemon</p>

            <div className='flex space-x-2'>
                {/* rows per page options */}
                <div className='flex items-center space-x-2'>
                    <p>Rows per page:</p>
                    <Dropdown items={rowsPerPageOption} canOpen={true} onSelect={changeRowsPerPage} defaultSelect={rowsPerPageOption[0]}/>
                </div>
                {/* sort options */}
                <div className='flex items-center space-x-2'>
                    <p>Sort by: </p>
                    <Dropdown items={pokemonSortOptions} canOpen={true} onSelect={changeSort} defaultSelect={pokemonSortOptions[0]}/>
                </div>
            </div>
        </div>

        {/* list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pokemonArrayToShow().map((pokemon) => (
               <div className="p-1 pokemonInList">
                    <div className="corner-top-right"></div>
                    <div className="corner-bottom-left"></div>
                    
                    <p
                        key={pokemon.name}
                        className="bg-slate-400 p-2 text-center rounded-md cursor-pointer font-semibold"
                        onClick={() => choosePokemon(pokemon)}
                    >
                        {pokemon.name}
                    </p>
                </div>
            ))}
        </div>

        {/* page turner */}
        <div className='mx-auto w-fit flex text-primaryRed items-center mt-6 text-xl pb-4'>
            <IoCaretBackOutline onClick={prevPage} size={30} className='arrowIcons'/>
            <p className='select-none text-black'>{currPage + 1} / {totalPageNumber()}</p>
            <IoCaretForwardOutline onClick={nextPage} size={30} className='arrowIcons'/>
        </div>
    </div>
  )
}

export default PokemonList