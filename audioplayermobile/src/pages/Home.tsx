import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonToolbar } from '@ionic/react';
import SatandardBody from '../components/SatandardBody';
import logoMaior from '../../public/assets/logoMaior.png';
import botaoAdicionar from '../../public/assets/botaoAdicionar.png';
import './Home.css';
import Modal from '../hooks/Modal';
import { JSX, useState } from 'react';

const Home: React.FC = () => {

  const [openModal, setOpenModal] = useState(false);

  function AddMusicsModal(): JSX.Element{

    const [data, setData] = useState('');

    return(
      <div className='flex flex-col gap-15 w-full px-2'>
        <form>
          <h2 className='text-center text-primary pt-5'>Adicionar Músicas</h2>
          <div className='flex gap-1 items-center pt-2'>
            <IonInput type='text' placeholder='Digite o nome da música...' class='!px-2 !text-white border border-borderGray rounded w-full h-11' value={data} onIonInput={(e) => setData(e.detail.value ?? "")}/>
            <IonButton type='submit' aria-label='Enviar' className='text-black capitalize bg-green-600 rounded w-14 h-11'>Enviar</IonButton>
          </div>
        
        </form>
      </div>
    )
  }

  return (
    <IonPage>
      <Modal isOpen={openModal} closed={() => setOpenModal(false)}>
        <AddMusicsModal/>
      </Modal>
      /* Header da pagina */
        <IonHeader className='h-15'>
          <IonToolbar/>
        </IonHeader>
        /* Corpo da pagina */
        <IonContent fullscreen>
          <SatandardBody>
            <h1 className='!text-2xl text-white'>Bem vindo(a) ao</h1>

            <div className='flex items-center justify-center -mt-3'>
              <span className='text-primary text-xl'>Audio</span>
              <img src={logoMaior} alt="Foto logo grande" loading='lazy' className='w-20 h-20' />
              <span className='text-primary text-xl'>Player</span>
            </div>

            <div className='flex flex-col'>
              <h2 className='!text-lg text-center text-white'>Clique no botão abaixo para adicionar suas músicas!</h2>
              <IonButton className='-mt-7' aria-label='Botão adicionar música' onClick={() => setOpenModal(true)}><img src={botaoAdicionar} alt="Imagem botão adicionar" className='h-44 w-44'/></IonButton>
            </div>
  
          </SatandardBody>
        </IonContent>
    </IonPage>
  );
};

export default Home;