import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import proximoLeft from "../../public/assets/proximoLeft.png";
import proximoRight from "../../public/assets/proximoRight.png";
import playButton from "../../public/assets/playButton.png";
import loop from "../../public/assets/loop.png";
import soundVolume from "../../public/assets/soundVolume.png";
import estrela from "../../public/assets/estrela.png";
import pause from "../../public/assets/pause.png";

import {
  ImusicsDb,
  PublicMusic,
  PageMusicProps,
  MusicaComAudio,
} from "../../../apiMusics/interfaces";

import { IonFooter } from "@ionic/react";

const Footer: React.FC<PageMusicProps> = ({
  setActive,
  setCurrentMusic,
  currentMusic,
  play,
  setPlay,
}) => {
  // 🔹 Buscar músicas públicas e do DB do usuário
  const { data: publicMusicas = [] } = useQuery<PublicMusic[]>({
    queryKey: ["publicMusicas"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/musicaLocal");
      if (!res.ok) throw new Error("Erro ao buscar músicas locais");
      return res.json();
    },
  });

  const { data: MusicasDb = [] } = useQuery<ImusicsDb[]>({
    queryKey: ["musicas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Você precisa estar logado");

      const res = await fetch("http://localhost:3000/api/musicas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar músicas do usuário");
      const musicas = await res.json();
      return musicas.musicas;
    },
  });

  // 🔹 Normalizador de nome
  const normalizeName = (str: string) =>
    str
      .toLowerCase()
      .replace(/\.mp3$/i, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");

  const BASE_URL = "http://localhost:3000/public/musicas";

  // 🔹 Vincular áudio público ao DB
  const musicasComAudio: MusicaComAudio[] = MusicasDb.map((m) => {
    const arquivo = publicMusicas.find((p) =>
      normalizeName(p.nome).includes(normalizeName(m.titulo))
    );

    return {
      ...m,
      path: arquivo
        ? `${BASE_URL}/${
            arquivo.nome.endsWith(".mp3") ? arquivo.nome : arquivo.nome + ".mp3"
          }`
        : null,
    };
  });

  const songRef = useRef<HTMLAudioElement | null>(null);
  const [randomMusic, setRandomMusic] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);

  const currentMusicObj =
    musicasComAudio.length > 0 &&
    currentMusic >= 0 &&
    currentMusic < musicasComAudio.length
      ? musicasComAudio[currentMusic]
      : null;

  // 🔹 Troca de música (sempre recarrega, mesmo se for a mesma)
  useEffect(() => {
    if (!songRef.current) return;

    const audio = songRef.current;
    audio.pause();

    if (!currentMusicObj?.path) {
      audio.src = "";
      setPlay(false);
      setCurrentTime(0);
      alert("Esta música não possui áudio disponível.");
      return;
    }

    // 🔸 Forçar reload mesmo que o src seja o mesmo
    audio.src = currentMusicObj.path;
    audio.load();
    setCurrentTime(0);

    audio
      .play()
      .then(() => setPlay(true))
      .catch((e) => console.error("Erro ao tocar música:", e));
  }, [currentMusicObj?.path, currentMusic]);

  // 🔹 Controla play/pause manual
  useEffect(() => {
    if (!songRef.current) return;

    const audio = songRef.current;
    if (play) {
      if (!currentMusicObj?.path) {
        alert("Esta música não possui áudio disponível.");
        setPlay(false);
        return;
      }
      audio.play().catch((e) => console.error("Erro ao tocar música:", e));
    } else {
      audio.pause();
    }
  }, [play]);

  // 🔹 Volume
  useEffect(() => {
    if (songRef.current) {
      songRef.current.volume = volume;
    }
  }, [volume]);

  // 🔹 Atualizar progresso
  useEffect(() => {
    if (!songRef.current) return;
    const audio = songRef.current;
    const updateProgress = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentMusic]);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (songRef.current) songRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlay = () => {
    if (!currentMusicObj?.path) {
      alert("Esta música não possui áudio disponível.");
      return;
    }
    setPlay((prev) => !prev);
  };

  const handleNext = () => {
    if (!musicasComAudio.length) return;

    let nextIndex = currentMusic;
    if (randomMusic) {
      nextIndex = Math.floor(Math.random() * musicasComAudio.length);
    } else {
      nextIndex = (currentMusic + 1) % musicasComAudio.length;
    }

    // 🔸 Atualiza mesmo se for a mesma faixa
    setCurrentMusic(nextIndex);
  };

  const handlePrev = () => {
    if (!musicasComAudio.length) return;

    let prevIndex =
      currentMusic === 0 ? musicasComAudio.length - 1 : currentMusic - 1;
    setCurrentMusic(prevIndex);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleRandomMusic = () => setRandomMusic((prev) => !prev);
  const onEndedRandom = () => handleNext();

  if (musicasComAudio.length === 0) {
    return (
      <footer className="bg-background rounded-lg p-4 text-white text-center">
        Carregando músicas...
      </footer>
    );
  }

  return (
    <IonFooter className="bg-background rounded-lg pt-1 px-2 mb-10">
      <audio ref={songRef} onEnded={onEndedRandom} />

      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-4">
          {/* Capa + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button className="cursor-pointer shrink-0" onClick={() => setActive(true)}>
              <img
                className="w-16 h-16 object-cover rounded-md"
                src={currentMusicObj?.thumb || "/assets/default-cover.png"}
                alt={currentMusicObj?.titulo || "Capa da música"}
              />
            </button>

            <div className="flex flex-col truncate">
              <span className="text-white text-sm font-semibold truncate">
                {currentMusicObj?.titulo || "Título desconhecido"}
              </span>
              <span className="text-xs text-gray-300 truncate">
                {currentMusicObj?.artista || "Artista desconhecido"}
              </span>
            </div>

            <button className="cursor-pointer shrink-0" title="Favoritar">
              <img src={estrela} alt="Favoritar" />
            </button>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-4">
            <button
              className={`cursor-pointer ${randomMusic ? "opacity-100" : "opacity-50"}`}
              onClick={handleRandomMusic}
              title="Aleatório"
            >
              <img className="w-6 h-6" src={loop} alt="Aleatório" />
            </button>

            <button onClick={handlePrev} title="Anterior">
              <img className="w-6 h-6" src={proximoLeft} alt="Anterior" />
            </button>

            <button onClick={handlePlay} title={play ? "Pausar" : "Tocar"}>
              <img
                className="w-10 h-10"
                src={play ? pause : playButton}
                alt="Play/Pause"
              />
            </button>

            <button onClick={handleNext} title="Próxima">
              <img className="w-6 h-6" src={proximoRight} alt="Próxima" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-white">{Math.round(volume * 100)}%</span>
            <div className="relative group flex items-center w-20">
              <img className="w-6 h-6" src={soundVolume} alt="Volume" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="absolute opacity-0 group-hover:opacity-100 ml-8 w-24 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Progresso */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-white w-8 text-center">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={songRef.current?.duration || 0}
            step={0.01}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1 cursor-pointer"
          />
          <span className="text-xs text-white w-8 text-center">
            {formatTime(songRef.current?.duration || 0)}
          </span>
        </div>
      </div>
    </IonFooter>
  );
};

export default Footer;
