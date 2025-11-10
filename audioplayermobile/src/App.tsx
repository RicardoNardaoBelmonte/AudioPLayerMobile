import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import './index.css';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css'; 
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

import Favs from './pages/Favs';
import Header from './components/Header';
import DropdownMenu from './components/DropdownMenu';
import FormUsers from './components/FormUsers';
import { AuthProvider } from './hooks/AuthContext';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import PageMusic from './components/PageMusic';
import { MusicaComAudio, ImusicsDb, PublicMusic } from '../../apiMusics/interfaces';
import { useQuery } from '@tanstack/react-query';

setupIonicReact();

const App: React.FC = () => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [tipoFormUsuarios, setTipoFormUsuarios] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [visibleFormUsuarios, setVisibleFormUsuarios] = useState<boolean>(false);
  const [visiblePageMusics, setVisiblePageMusics] = useState<boolean>(false);

  const [play, setPlay] = useState<boolean>(false);
  const [currentMusic, setCurrentMusic] = useState<number>(0);

  const [selectedMusic, setSelectedMusic] = useState<MusicaComAudio | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, [isLogged]); 

  const { data: publicMusicas = [] } = useQuery<PublicMusic[]>({
    queryKey: ["publicMusicas"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/musicaLocal");
      return res.json();
    },
  });

  const { data: MusicasDb = [] } = useQuery<ImusicsDb[]>({
    queryKey: ["musicas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/musicas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const musicas = await res.json();
      return musicas.musicas;
    },
  });

  const [musicasComAudio, setMusicasComAudio] = useState<MusicaComAudio[]>([]);

  useEffect(() => {
    const normalizeName = (str: string) =>
      str
        .toLowerCase()
        .replace(/\.mp3$/i, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

    const BASE_URL = "http://localhost:3000/public/musicas";
    if (MusicasDb.length && publicMusicas.length) {
      const lista = MusicasDb.map((m) => {
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
      setMusicasComAudio(lista);
    }
  }, [MusicasDb, publicMusicas]);

  return (
    <IonApp>
        <AuthProvider>
          <IonReactRouter>

            <DropdownMenu isOpen={isOpen} />

            {visibleFormUsuarios && (
              <FormUsers
                setVisibleFormUsuarios={setVisibleFormUsuarios}
                tipoFormUsuarios={tipoFormUsuarios}
                setIsLogged={setIsLogged}
              />
            )}

            <Header
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setVisibleFormUsuarios={setVisibleFormUsuarios}
              setTipoFormUsuarios={setTipoFormUsuarios}
              isLogged={isLogged}
              setIsLogged={setIsLogged}
            />

            {visiblePageMusics && (
              <PageMusic
                setActive={setVisiblePageMusics}
                setCurrentMusic={setCurrentMusic}
                currentMusic={currentMusic}
                play={play}
                setPlay={setPlay}
                selectedMusic={selectedMusic}
                setSelectedMusic={setSelectedMusic}
                musicasComAudio={musicasComAudio}
              />
            )}

            <IonRouterOutlet>
              <Route exact path="/home">
                <Home />
              </Route>

              <Route exact path="/">
                <Redirect to="/home" />
              </Route>

              <Route exact path="/favs">
                <Favs
                  setActive={setVisiblePageMusics}
                  setCurrentMusic={setCurrentMusic}
                  setPlay={setPlay}
                />
              </Route>
            </IonRouterOutlet>

            {!visiblePageMusics && (
              <Footer
                setActive={setVisiblePageMusics}
                setCurrentMusic={setCurrentMusic}
                currentMusic={currentMusic}
                play={play}
                setPlay={setPlay}
                selectedMusic={selectedMusic}
                setSelectedMusic={setSelectedMusic}
                musicasComAudio={musicasComAudio}
                isLogged={isLogged} // ADICIONADO
              />
            )}

          </IonReactRouter>
        </AuthProvider>
    </IonApp>
  );
};

export default App;