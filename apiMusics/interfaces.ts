import { Dispatch, ReactNode, SetStateAction } from "react";

export interface ICriarMusica {
    titulo: string;
    artista: string;
    path: string;
    thumb: string;
    duracao: string;
    usuario_id: number;
}

export interface IUsuario{
    id: number;
    nome: string;
    senha: string;
}

export interface IMusicSpotfy{
    nome: string;
    artista: string;
    thumb: string | undefined;
    duracao: number;
}

interface SpotifyTrack {
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export interface SpotifyResponse {
  tracks: { items: SpotifyTrack[] };
}

export interface ImusicsDb {
    id: number;
    titulo: string;
    artista: string;
    path: string;
    thumb: string;
    duracao: string;
    usuario_id: number;
}
export interface PublicMusic {
  nome: string;
  path: string;
}

export type MusicaComAudio = Omit<ImusicsDb, "path"> & {
  path: string | null;
};

export interface AuthContextType {
  token: string | null;
  nome: string;
  setToken: (token: string | null) => void;
  setNome: (nome: string) => void; 
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface IFavs {
  setActive: Dispatch<SetStateAction<boolean>>;
  setCurrentMusic: Dispatch<SetStateAction<number>>;
  setPlay :Dispatch<SetStateAction<boolean>>;
}

export interface PageMusicProps {
  setActive: Dispatch<SetStateAction<boolean>>;
  currentMusic: number;
  setCurrentMusic: Dispatch<SetStateAction<number>>;
  selectedMusic: MusicaComAudio | null;
  setSelectedMusic: Dispatch<SetStateAction<MusicaComAudio | null>>;
  play: boolean;
  setPlay: Dispatch<SetStateAction<boolean>>;
  musicasComAudio: MusicaComAudio[]; // ADICIONADO
}

export interface FooterMusicProps {
  currentMusic: number;
  setCurrentMusic: Dispatch<SetStateAction<number>>;
  selectedMusic: MusicaComAudio | null;
  setSelectedMusic: Dispatch<SetStateAction<MusicaComAudio | null>>;
  play: boolean;
  setPlay: Dispatch<SetStateAction<boolean>>;
  setActive: Dispatch<SetStateAction<boolean>>;
  musicasComAudio: MusicaComAudio[]; // ADICIONADO
  isLogged: boolean; // ADICIONADO
}