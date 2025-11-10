import { useQuery } from "@tanstack/react-query";
import {useRef, useState, useEffect } from "react";
import proximoLeft from '../../public/assets/proximoLeft.png';
import proximoRight from '../../public/assets/proximoRight.png';
import playButton from '../../public/assets/playButton.png';
import loop from '../../public/assets/loop.png';
import soundVolume from '../../public/assets/soundVolume.png';
import pause from '../../public/assets/pause.png';
import voltar from '../../public/assets/voltar.png';


export default function PageMusic({active, setActive, setCurrentMusic, currentMusic, play, setPlay}) {

    const {data: publicMusicas = []} = useQuery({
        queryKey: ['publicMusicas'],
        queryFn: async () => {

            const res = await fetch('/api/publicMusicas',)

            if(!res.ok) throw new Error("Erro ao buscar músicas do usuário");
            const publicMusicas = await res.json();
            return publicMusicas;
        }
    })

    const {data: MusicasDb = []} = useQuery({
        queryKey: ['musicas'],
        queryFn: async () => {

            const token = localStorage.getItem('token');

            if (!token) throw new Error("Você precisa estar Logado");

            const res = await fetch('/api/musicas', {
                headers: { Authorization: `Bearer ${token}`}
            });

            if(!res.ok) throw new Error("Erro ao buscar músicas do usuário");
            const musicas = await res.json();
            return musicas.musicas;
        }
    })

    const musicasComAudio = MusicasDb.map(m => {
        const arquivo = publicMusicas.find(p => p.nome.includes(m.path));
        return {
          ...m,
          path: arquivo?.path || null,
        };
    });

    const progress = useRef(null);
    const song = useRef(null);
    const playControl  = useRef(null);
    const [randomMusic, setRandomMusic] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        if (!song.current) return;
    
        song.current.pause();
        song.current.load();
    
        if (play) song.current.play();


    }, [currentMusic, play]);

    useEffect(() => {
        if (!song.current) return;
    
        const audio = song.current;
    
        // Função para atualizar o currentTime
        const updateProgress = () => setCurrentTime(audio.currentTime);
    
        // Atualiza imediatamente ao dar play, não espera o primeiro evento
        if (!audio.paused) {
            setCurrentTime(audio.currentTime);
        }
    
        // Adiciona listener
        audio.addEventListener('timeupdate', updateProgress);
    
        return () => audio.removeEventListener('timeupdate', updateProgress);
    }, [currentMusic, play]);
    
    
    
    function handleProgressChange(e) {
        const newTime = parseFloat(e.target.value);
        if(song.current) {
             song.current.currentTime = newTime;
        }
        setCurrentTime(newTime);
    }

    function handlePlay(){
        setPlay(prev => {
            const newState = !prev;  
            if(newState){
                song.current.play();
            }else{
                song.current.pause();
            }

            return newState;
        });
    }

    function handleNext() {
        if(randomMusic){
            setCurrentMusic(Math.floor(Math.random() * musicasComAudio.length));
        } else {
            setCurrentMusic(prev => (prev + 1) % musicasComAudio.length);
        }
    }
    

    function handlePrev() {
        setCurrentMusic(prev => prev === 0 ? musicasComAudio.length - 1 : prev - 1);
    }
    
    function handleVolumeChange(e) {
        const newVolume = parseFloat(e.target.value); 
        setVolume(newVolume);
        if (song.current) song.current.volume = newVolume;
    }

    function handleRandomMusic() {
        setRandomMusic(prev => {
            const newRandom = !prev;
            if(newRandom && musicasComAudio.length > 0){
                setCurrentMusic(Math.floor(Math.random() * musicasComAudio.length));
            }
            return newRandom;
        });
    }
    
    function onEndedRandom(){
        if(randomMusic){
            setCurrentMusic(Math.floor(Math.random() * musicasComAudio.length));
        } else {
            setCurrentMusic(prev => (prev + 1) % musicasComAudio.length);
        }
    }
    
    return(
        <div className="mt-30 h-[80vh] bg-background mx-5 md:mx-10 lg:mx-42 xl:mx-72 2xl:mx-96 min-w-56 relative">

            <button onClick={() => setActive(false)} className="absolute top-5 left-5 cursor-pointer p-2 rounded" aria-label="go-back button">
                <Image src={voltar} alt="Voltar" width={40} height={15}/>
            </button>
            
            {musicasComAudio[0]?.path && (
                <audio onEnded={() => onEndedRandom()} ref={song} id='song'>
                    <source  src={musicasComAudio[currentMusic]?.path || ""} type="audio/mpeg"  />
                </audio>
            )}

            {musicasComAudio.length > 0 &&(
                <div key={musicasComAudio[currentMusic].titulo} className="flex flex-col">
                <div className="flex flex-col justify-center text-center text-white mt-5 gap-2">
                    <span className="text-base xl:text-lg">{musicasComAudio[currentMusic].titulo}</span>
                    <span className="text-gray-400 texte-base">{musicasComAudio[currentMusic].artista}</span>
                </div>

                <div className="flex justify-center mt-10">
                    <Image className="rounded" src={musicasComAudio[currentMusic].thumb} alt={musicasComAudio[currentMusic].titulo} width={300} height={100}/>
                </div>

                <div className="text-gray-400 text-base flex justify-center mt-5">
                    <span>{musicasComAudio[currentMusic].duracao}</span>
                </div>

                <div className="min-w-[18rem] xl:w-[30rem] flex align-center justify-center mx-auto mt-5">
                    <input alt="music progress" type='range' min={0} max={song.current?.duration || 0} step={0.01} value={currentTime} className='' id='progress' ref={progress} onChange={handleProgressChange}/>
                </div>


                <div className="flex items-center mt-15 justify-center relative">

                    <div className="flex gap-15 lg:gap-28">
                        <button className="cursor-pointer" onClick={() => handleRandomMusic()} aria-label="random music">
                            <img className="w-5 h-5" src={loop} alt="aleatório" loading="lazy" />
                        </button>

                        <button className="cursor-pointer" onClick={() => handlePrev()} aria-label="prev music">
                            <img className="w-6 h-6" src={proximoLeft} alt="Anterior" loading="lazy"/>
                        </button>

                        <button className="cursor-pointer" ref={playControl} onClick={() => handlePlay()} aria-label="play and pause">
                            <img className="w-10 h-10" src={ play ? pause : playButton} alt="Play"loading="lazy" />
                        </button>

                        <button className="cursor-pointer" onClick={() => handleNext()} aria-label="next music">
                            <img className="w-6 h-6" src={proximoRight} alt="Próxima" loading="lazy"/>
                        </button>
                    </div>

                    <div className='relative group absolute -right-10  md:-right-13 xl:-right-24 flex items-center w-20'>
                        <button className="cursor-pointer relative flex items-center gap-2" aria-label="sound volume">
                            <img className="w-6 h-6" src={soundVolume} alt="Volume" />
                        </button>
                        <input alt="sound volume bar" type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolumeChange} className="absolute opacity-0 group-hover:opacity-100 ml-8" id='volume'/>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}