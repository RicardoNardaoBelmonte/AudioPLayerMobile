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

  return (
    <IonPage>
      /* Header da pagina */
     {<DropdownMenu isOpen={isOpen} />}
     { visibleFormUsuarios && <FormUsuarios visibleFormUsuarios={visibleFormUsuarios} setVisibleFormUsuarios={setVisibleFormUsuarios} />}
        <IonHeader>
          <IonToolbar>
            <Header isOpen={isOpen} setIsOpen={setIsOpen}/>
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
