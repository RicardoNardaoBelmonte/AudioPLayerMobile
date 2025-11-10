import { useEffect, useRef, useState } from "react";
import { FooterMusicProps } from "../../../apiMusics/interfaces";

import proximoLeft from "../../public/assets/proximoLeft.png";
import proximoRight from "../../public/assets/proximoRight.png";
import playButton from "../../public/assets/playButton.png";
import loop from "../../public/assets/loop.png";
import soundVolume from "../../public/assets/soundVolume.png";
import estrela from "../../public/assets/estrela.png";
import pause from "../../public/assets/pause.png";

import { IonFooter } from "@ionic/react";

const Footer: React.FC<FooterMusicProps> = ({
  setActive,
  setCurrentMusic,
  currentMusic,
  play,
  setPlay,
  selectedMusic,
  setSelectedMusic,
  musicasComAudio,
  isLogged,
}) => {
  const songRef = useRef<HTMLAudioElement | null>(null);
  const [randomMusic, setRandomMusic] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // limpa seleção se não estiver logado ou não houver músicas
  useEffect(() => {
    if (!isLogged || musicasComAudio.length === 0) {
      setSelectedMusic(null);
      setPlay(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, musicasComAudio.length]);

  const currentMusicObj =
    musicasComAudio.length > 0 &&
    currentMusic >= 0 &&
    currentMusic < musicasComAudio.length
      ? musicasComAudio[currentMusic]
      : null;

  useEffect(() => {
    if (!currentMusicObj) return;
    setSelectedMusic((prev) => {
      if (prev && prev.id === currentMusicObj.id) return prev;
      return currentMusicObj;
    });
  }, [currentMusicObj, setSelectedMusic]);

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;

    audio.pause();

    if (!currentMusicObj?.path) {
      audio.src = "";
      setPlay(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    if (audio.src !== currentMusicObj.path) {
      audio.src = currentMusicObj.path;
    }
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    audio
      .play()
      .then(() => setPlay(true))
      .catch(() => {
        setPlay(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMusicObj?.path, currentMusic]);

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;

    if (play) {
      if (!currentMusicObj?.path) {
        setPlay(false);
        return;
      }
      audio.play().catch(() => {
        setPlay(false);
      });
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, currentMusicObj?.path]);

  useEffect(() => {
    if (songRef.current) songRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMeta = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime || 0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
    };
  }, [currentMusicObj?.path]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value) || 0;
    if (songRef.current) songRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlay = () => {
    if (!currentMusicObj?.path) {
      alert("Esta música não possui áudio disponível.");
      return;
    }
    setPlay((p) => !p);
  };

  const handleNext = () => {
    if (!musicasComAudio.length) return;
    let nextIndex = currentMusic;
    if (randomMusic) {
      nextIndex = Math.floor(Math.random() * musicasComAudio.length);
    } else {
      nextIndex = (currentMusic + 1) % musicasComAudio.length;
    }
    setCurrentMusic(nextIndex);
    // se próxima não tiver audio, desliga play e avisa
    if (!musicasComAudio[nextIndex].path) {
      setPlay(false);
      alert("A próxima música não possui áudio disponível.");
    }
  };

  const handlePrev = () => {
    if (!musicasComAudio.length) return;
    const prevIndex =
      currentMusic === 0 ? musicasComAudio.length - 1 : currentMusic - 1;
    setCurrentMusic(prevIndex);
    if (!musicasComAudio[prevIndex].path) {
      setPlay(false);
      alert("A música anterior não possui áudio disponível.");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) || 0;
    setVolume(newVolume);
  };

  const handleRandomMusic = () => setRandomMusic((r) => !r);

  const onEndedRandom = () => handleNext();

  // Mensagens quando não logado ou sem músicas
  if (!isLogged) {
    return (
      <IonFooter className="bg-background rounded-lg py-4 px-4 mb-5">
        <div className="flex items-center justify-center p-3 text-white">
          Você precisa estar logado para ver suas músicas.
        </div>
      </IonFooter>
    );
  }

  if (musicasComAudio.length === 0) {
    return (
      <IonFooter className="bg-background rounded-lg py-4 px-4 mb-5">
        <div className="flex items-center justify-center p-3 text-white">
          Você não tem músicas.
        </div>
      </IonFooter>
    );
  }

  return (
    <IonFooter className="bg-background rounded-lg py-1 px-2 mb-5">
      <audio ref={songRef} onEnded={onEndedRandom} />

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {/* Capa + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              className="cursor-pointer shrink-0"
              onClick={() => setActive(true)}
            >
              <img
                className="w-10 h-10 object-cover rounded-md"
                src={
                  selectedMusic?.thumb ||
                  currentMusicObj?.thumb ||
                  "/assets/default-cover.png"
                }
                alt={
                  selectedMusic?.titulo ||
                  currentMusicObj?.titulo ||
                  "Capa da música"
                }
              />
            </button>

            <div className="flex flex-col truncate">
              <span className="text-white text-sm font-semibold ">
                {selectedMusic?.titulo ||
                  currentMusicObj?.titulo ||
                  "Título desconhecido"}
              </span>

              <span className="text-xs text-gray-300 ">
                {selectedMusic?.artista ||
                  currentMusicObj?.artista ||
                  "Artista desconhecido"}
              </span>
            </div>

            <button className="cursor-pointer shrink-0" title="Favoritar">
              <img src={estrela} alt="Favoritar" className="w-3 h-3" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <div className="relative group flex items-center w-20">
              <img className="w-4 h-4" src={soundVolume} alt="Volume" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="absolute w-15 !ml-5"
                id="volume"
              />
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4 justify-center mt-2">
          <button
            className={`cursor-pointer ${
              randomMusic ? "opacity-100" : "opacity-50"
            }`}
            onClick={handleRandomMusic}
            title="Aleatório"
          >
            <img className="w-4 h-4" src={loop} alt="Aleatório" />
          </button>

          <button onClick={handlePrev} title="Anterior">
            <img className="w-4 h-4" src={proximoLeft} alt="Anterior" />
          </button>

          <button onClick={handlePlay} title={play ? "Pausar" : "Tocar"}>
            <img
              className="w-4 h-4"
              src={play ? pause : playButton}
              alt="Play/Pause"
            />
          </button>

          <button onClick={handleNext} title="Próxima">
            <img className="w-4 h-4" src={proximoRight} alt="Próxima" />
          </button>
        </div>

        {/* Barra de Progresso */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-white w-8 text-center">
            {formatTime(currentTime)}
          </span>

          <input
            id="progress"
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1"
          />

          <span className="text-xs text-white w-8 text-center">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </IonFooter>
  );
};

export default Footer;