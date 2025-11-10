import { useEffect, useRef, useState } from "react";
import { PageMusicProps } from "../../../apiMusics/interfaces";

import proximoLeft from "../../public/assets/proximoLeft.png";
import proximoRight from "../../public/assets/proximoRight.png";
import playButton from "../../public/assets/playButton.png";
import loop from "../../public/assets/loop.png";
import soundVolume from "../../public/assets/soundVolume.png";
import pause from "../../public/assets/pause.png";
import voltar from "../../public/assets/voltar.png";

const PageMusic: React.FC<PageMusicProps> = ({
  setActive,
  setCurrentMusic,
  currentMusic,
  play,
  setPlay,
  selectedMusic,
  setSelectedMusic,
  musicasComAudio 
}) => {
  const song = useRef<HTMLAudioElement | null>(null);

  const [randomMusic, setRandomMusic] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (
      musicasComAudio &&
      musicasComAudio.length > 0 &&
      currentMusic >= 0 &&
      currentMusic < musicasComAudio.length
    ) {
      setSelectedMusic(musicasComAudio[currentMusic]);
    }
  }, [currentMusic, musicasComAudio, selectedMusic, setSelectedMusic]);

  useEffect(() => {
    const audio = song.current;
    if (!audio || !selectedMusic?.path) return;

    audio.pause();
    audio.src = selectedMusic.path;
    audio.load();

    if (play) {
      audio.play().catch(() => setPlay(false));
    }

    setCurrentTime(0);
  }, [selectedMusic, setPlay, play]);

  useEffect(() => {
    const audio = song.current;
    if (!audio) return;

    if (play) {
      audio.play().catch(() => setPlay(false));
    } else {
      audio.pause();
    }
  }, [play, setPlay]);

  useEffect(() => {
    if (song.current) song.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = song.current;
    if (!audio) return;

    const update = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

    function handlePlay() {
    if (!selectedMusic?.path) {
        alert("Esta música não possui áudio disponível.");
        return;
    }
    setPlay((prev) => !prev);
    }

  function handleProgressChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (song.current) song.current.currentTime = newTime;
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    setVolume(v);
  }

    function handleNext() {
    if (!musicasComAudio.length) return;
    const nextIndex = (currentMusic + 1) % musicasComAudio.length;
    setCurrentMusic(nextIndex);
    setSelectedMusic(musicasComAudio[nextIndex]);
    if (!musicasComAudio[nextIndex].path) {
        setPlay(false);
        alert("A próxima música não possui áudio disponível.");
    }
    }

    function handlePrev() {
    if (!musicasComAudio.length) return;
    const prevIndex =
        currentMusic === 0 ? musicasComAudio.length - 1 : currentMusic - 1;
    setCurrentMusic(prevIndex);
    setSelectedMusic(musicasComAudio[prevIndex]);
    if (!musicasComAudio[prevIndex].path) {
        setPlay(false);
        alert("A música anterior não possui áudio disponível.");
    }
}

  function handleRandomMusic() {
    setRandomMusic((prev) => !prev);
  }

    function onEndedRandom() {
    if (randomMusic && musicasComAudio.length > 0) {
        const randIndex = Math.floor(Math.random() * musicasComAudio.length);
        setCurrentMusic(randIndex);
        setSelectedMusic(musicasComAudio[randIndex]);
        if (!musicasComAudio[randIndex].path) {
        setPlay(false);
        alert("A música sorteada não possui áudio disponível.");
        }
    } else {
        handleNext();
    }
    }

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <button
        onClick={() => setActive(false)}
        className="absolute top-5 left-5 cursor-pointer p-2 rounded"
      >
        <img src={voltar} alt="Voltar" width={40} height={15} />
      </button>

      <audio onEnded={onEndedRandom} ref={song}>
        <source src={selectedMusic?.path ?? ""} type="audio/mpeg" />
      </audio>

      <div className="w-full h-full flex flex-col items-center justify-center px-5">
        <div className="flex flex-col items-center mb-7">
          <img
            src={selectedMusic?.thumb ?? ""}
            alt="Capa"
            className="w-56 h-56 rounded-lg object-cover"
          />
          <p className="text-white text-xl font-bold mt-4">
            {selectedMusic?.titulo}
          </p>
          <p className="text-sm text-textPrimary text-center">
            {selectedMusic?.artista}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 mt-2">
          <input
            id="progress"
            type="range"
            min={0}
            value={currentTime}
            max={song.current?.duration ?? 0}
            onChange={handleProgressChange}
            className="flex-1"
          />
        </div>

        <div className="flex items-center justify-between w-full mt-5">
          <button onClick={handleRandomMusic} className="flex !pl-5 w-1/3">
            <img
              src={loop}
              alt="Aleatório"
              width={20}
              height={20}
              style={{ opacity: randomMusic ? 1 : 0.3 }}
            />
          </button>

          <div className="flex items-center gap-5 justify-center w-1/3">
            <button onClick={handlePrev}>
              <img src={proximoLeft} alt="Anterior" width={20} height={20} />
            </button>

            <button onClick={handlePlay}>
              <img
                src={play ? pause : playButton}
                alt="Play Pause"
                width={35}
                height={35}
              />
            </button>

            <button onClick={handleNext}>
              <img src={proximoRight} alt="Próxima" width={20} height={20} />
            </button>
          </div>

          <div className="flex pl-7 w-1/3">
            <div className="relative group flex items-center gap5">
              <img className="w-4 h-4" src={soundVolume} alt="Volume" />

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="absolute w-13 !ml-5"
                id="volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageMusic;