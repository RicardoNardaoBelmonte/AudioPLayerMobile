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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Favs from './pages/Favs';
import Header from './components/Header';
import { useState } from 'react';
import DropdownMenu from './components/DropdownMenu';
import FormUsers from './components/FormUsers';

setupIonicReact();

const queryClient = new QueryClient();



const App: React.FC = () =>{ 
  const [nome, setNome] = useState<string>("");
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [tipoFormUsuarios, setTipoFormUsuarios] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [visibleFormUsuarios, setVisibleFormUsuarios] = useState<boolean>(false);



  return(
  <IonApp>
    <QueryClientProvider client={queryClient}>
      <IonReactRouter>
          {<DropdownMenu isOpen={isOpen} />}
          { visibleFormUsuarios && <FormUsers setVisibleFormUsuarios={setVisibleFormUsuarios} tipoFormUsuarios={tipoFormUsuarios} setNome={setNome} setIsLogged={setIsLogged}/>}
          <Header isOpen={isOpen} setIsOpen={setIsOpen} setVisibleFormUsuarios={setVisibleFormUsuarios} setTipoFormUsuarios={setTipoFormUsuarios} isLogged={isLogged} setIsLogged={setIsLogged} nome={nome} setNome={setNome}/>
        <IonRouterOutlet>
            <Route exact path="/home">
              <Home/>
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route exact path="/favs">
              <Favs/>
            </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </QueryClientProvider>
  </IonApp>
  )
};

export default App;
