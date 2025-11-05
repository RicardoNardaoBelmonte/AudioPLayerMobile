import { Dispatch, SetStateAction } from "react";

export interface IHeader {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IDropdown {
    isOpen: boolean;
}

export interface IFormUsuarios {
    visibleFormUsuarios: boolean;
    setVisibleFormUsuarios: Dispatch<SetStateAction<boolean>>;
}