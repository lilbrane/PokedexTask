import React, { useEffect, useState } from 'react';

interface DropdownProps {
  items: string[]; 
  onSelect: (item: string) => void; 
  canOpen: boolean;
  defaultSelect?: string | null;
}

const Dropdown: React.FC<DropdownProps> = ({ items, onSelect, canOpen, defaultSelect = null}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelect(item);
  };

  const openDropdown = () => {
    if(canOpen)
      setIsOpen(!isOpen)
  }

  useEffect(() => {
    setSelectedItem(defaultSelect);
  }, []);

  return (
    <div className="relative inline-block min-w-24 w-auto">

      {/* open button */}
      <button
        type="button"
        onClick={openDropdown}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primaryBlue"
      >
        {selectedItem || "..."}
        <span className="ml-1 float-right">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-primaryBlue hover:text-white"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
