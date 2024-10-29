"use client";

import { useState } from "react";

import CaretDown from "../atoms/icons/caret-down";
import { Faculty } from "@/lib/types/faculty.type";
import CaretUp from "../atoms/icons/caret-up";

type MultiSelectProps = {
  placeholder: string;
  items: Faculty[],
  selectedItem: Faculty | undefined;
  onSelecteItem: (id: number) => void;
  hasError?: boolean;
}

export default function MultiSelect({hasError, placeholder, items, selectedItem, onSelecteItem}: MultiSelectProps) {
  const [showList, setShowList] = useState(false);

  function handleSelectedItem(id: number) {
    onSelecteItem(id);
    setShowList(false);
  }

  let fieldText = selectedItem ? selectedItem.name : placeholder;

  return (
    <div className="relative">
      <button 
        className={`flex justify-between w-full py-[9px] px-4 bg-transparent border border-[var(--gray-700)] rounded-lg ${hasError && 'border-[var(--error-100)]'}`} 
        type="button" 
        onClick={() => setShowList(!showList)}>
        <span className={selectedItem ? 'text-[var(--black-200)]' : 'text-[var(--gray-700)]'}>{fieldText}</span>
        <span className="flex gap-1">
          {!showList ? <CaretDown /> : <CaretUp />}
        </span>
      </button>
      {showList && (
        <div 
          className="p-[15px] flex flex-col gap-4 rounded-lg shadow-md absolute w-full left-0 max-h-[175px] overflow-y-auto bg-white">
          {items.map(item => (
            <label key={item.id} className="flex gap-2 cursor-pointer group">
              <input type="radio" name="select" 
                value={item.id} onChange={() => handleSelectedItem(item.id!)}
                checked={item.id === selectedItem?.id}
                className="peer" /> 
              <span className="group-hover:text-[var(--sea-blue-100)] peer-checked:font-semibold peer-checked:text-[var(--sea-blue-100)]">{item.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}