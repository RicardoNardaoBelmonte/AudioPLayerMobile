import { IonContent, IonHeader, IonPage, IonToolbar, } from '@ionic/react';
import SatandardBody from '../components/SatandardBody';
import './Home.css';


const Favs: React.FC = () => {
    return(
    <IonPage>
      /* Componente para decretar que existe um Header na página */
        <IonHeader className='h-9'>
          <IonToolbar/>
        </IonHeader>
        /* Corpo da pagina */
        <IonContent fullscreen>
          <SatandardBody/>
        </IonContent>
    </IonPage>
    )
}

export default Favs;