
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