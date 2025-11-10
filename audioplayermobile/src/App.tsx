import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import './index.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import Favs from './pages/Favs';
import Header from './components/Header';
import DropdownMenu from './components/DropdownMenu';
import FormUsers from './components/FormUsers';
import { AuthProvider } from './hooks/AuthContext';
import Footer from './components/Footer';
import { useState } from 'react';

setupIonicReact();

const queryClient = new QueryClient();

const App: React.FC = () => {

  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [tipoFormUsuarios, setTipoFormUsuarios] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [visibleFormUsuarios, setVisibleFormUsuarios] = useState<boolean>(false);
  const [visiblePageMusics, setVisiblePageMusics] = useState<boolean>(false);
  const [currentMusic, setCurrentMusic] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(false);

  return (
    <IonApp>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <IonReactRouter>
            {<DropdownMenu isOpen={isOpen} />}
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
            <Footer
              setActive={setVisiblePageMusics}
              setCurrentMusic={setCurrentMusic}
              currentMusic={currentMusic}
              play={play}
              setPlay={setPlay}
            />
          </IonReactRouter>
        </AuthProvider>
      </QueryClientProvider>
    </IonApp>
  );
};

export default App;
