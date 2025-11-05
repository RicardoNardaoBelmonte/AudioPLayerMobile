import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import Header from '../components/Header';
import './Home.css';
import FormUsuarios from '../components/FormUsuarios';
import { useState } from 'react';
import DropdownMenu from '../components/DropdownMenu';

const Home: React.FC = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [visibleFormUsuarios, setVisibleFormUsuarios] = useState<boolean>(false);
  const [tipoFormUsuarios, setTipoFormUsuarios] = useState<string>("");
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [nome, setNome] = useState<string>("");

  return (
    <IonPage>
      /* Header da pagina */
     {<DropdownMenu isOpen={isOpen} />}
     { visibleFormUsuarios && <FormUsuarios setVisibleFormUsuarios={setVisibleFormUsuarios} tipoFormUsuarios={tipoFormUsuarios} setNome={setNome} setIsLogged={setIsLogged}/>}
        <IonHeader>
          <IonToolbar>
            <Header isOpen={isOpen} setIsOpen={setIsOpen} setVisibleFormUsuarios={setVisibleFormUsuarios} setTipoFormUsuarios={setTipoFormUsuarios} isLogged={isLogged} setIsLogged={setIsLogged} nome={nome} setNome={setNome}/>
          </IonToolbar>
        </IonHeader>
        /* Corpo da pagina */
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">AudioPlayer</IonTitle>
            </IonToolbar>
          </IonHeader>
          <ExploreContainer />
        </IonContent>
    </IonPage>
  );
};

export default Home;
