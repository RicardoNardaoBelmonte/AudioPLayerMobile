import { IMusicSpotfy, SpotifyResponse } from "./interfaces.js";

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

async function getAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}
  
export async function buscarMusica(nomeMusica: string): Promise<IMusicSpotfy[]> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(nomeMusica)}&type=track&limit=3`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data: SpotifyResponse = await response.json();

  return data.tracks.items.map(track => ({
    nome: track.name,
    artista: track.artists.map(a => a.name).join(', '),
    thumb: track.album.images[0]?.url || null, 
    duracao: track.duration_ms,
  }));
}
  