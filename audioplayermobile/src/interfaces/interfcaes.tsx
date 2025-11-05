import { Dispatch, SetStateAction } from "react";

export interface IHeader {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setVisibleFormUsuarios: Dispatch<SetStateAction<boolean>>;
    setTipoFormUsuarios :  Dispatch<SetStateAction<string>>;
    nome: string;
    setNome: Dispatch<SetStateAction<string>>;
    isLogged: boolean;
    setIsLogged: Dispatch<SetStateAction<boolean>>;
}

export interface IDropdown {
    isOpen: boolean;
}

export interface IFormUsuarios {
    setVisibleFormUsuarios: Dispatch<SetStateAction<boolean>>;
    tipoFormUsuarios: string;
    setNome: Dispatch<SetStateAction<string>>;
    setIsLogged: Dispatch<SetStateAction<boolean>>;
}