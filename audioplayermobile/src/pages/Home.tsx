import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonToolbar } from '@ionic/react';
import SatandardBody from '../components/SatandardBody';
import logoMaior from '../../public/assets/logoMaior.png';
import botaoAdicionar from '../../public/assets/botaoAdicionar.png';
import './Home.css';
import Modal from '../hooks/Modal';
import { FormEvent, JSX, useState } from 'react';
import { IMusicSpotfy } from '../../../apiMusics/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Home: React.FC = () => {
  const queryClient = useQueryClient();


  const [openModal, setOpenModal] = useState<boolean>(false);
  const [musicas, setMusicas] = useState<IMusicSpotfy[]>([]);

   const adicionarMutation = useMutation({
        mutationFn: async (data: {musica: IMusicSpotfy, path: string}) => {
          const token = localStorage.getItem("token");

          const res = await fetch("http://localhost:3000/api/musicas", {
            method: "POST", 
            headers: { Authorization: `Bearer ${token}`,  "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Erro ao buscar músicas");
          return json;
        },
        onSuccess: () => {alert("Música adicionada com sucesso");queryClient.invalidateQueries({ queryKey: ['musicas'] });},
        onError: (e) => alert(e.message || "Erro ao buscar músicas"),
    });

  const buscarMusicaMutation = useMutation({
    mutationFn: async (nome: string) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/spotify?nome=${encodeURIComponent(nome)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao buscar músicas");
      return json;
    },

    onSuccess: (data) => {
      alert("Músicas buscadas com sucesso");
      setMusicas(data);
    },

    onError: (e: any) => {
      alert(e.message);
    },
  });

    async function handleSubmit(e:  FormEvent<HTMLFormElement>, nomeMusica: string){
      e.preventDefault();

      if(!nomeMusica) return ;

      buscarMusicaMutation.mutate(nomeMusica);
    }  

  function AddMusicsModal(): JSX.Element{

    const [data, setData] = useState('');

    return(
      <div className='flex flex-col gap-15 w-full px-2 h-[2rem]'>
        <form onSubmit={(e) => handleSubmit(e, data)}>
          <h2 className='text-center text-primary pt-5'>Adicionar Músicas</h2>
          <div className='flex gap-1 items-center pt-2'>
            <IonInput  type='text' placeholder='Digite o nome da música...' className='!px-2 !text-white border border-borderGray rounded w-full h-11' value={data} onIonInput={(e) => setData(e.detail.value ?? "")}/>
            <IonButton type='submit' aria-label='Enviar' className='text-black capitalize bg-green-600 rounded w-14 h-11'>Enviar</IonButton>
          </div>

          <div className='flex flex-col gap-5 mt-5'>
            {musicas.map((musica,index) => {

                const path = musica.nome.toLowerCase().replace(/\s+/g, '');
                return (
                    <div className='flex items-center gap-2 p-2 rounded border border-borderGray relative' key={index}>
                        <img src={musica.thumb} alt='Thumb da Musica' width={40} height={40}/>
                        <div className='flex flex-col gap-2'>
                            <span className='text-white  text-xs truncate w-40'>{musica.nome}</span>
                            <span className='text-white  text-xs truncate w-30'>{musica.artista}</span>
                        </div>
                        <button aria-label='add music' onClick={() => adicionarMutation.mutate({musica, path})} className='absolute right-1 text-xs !p-1 bg-green-500 text-white cursor-pointer !rounded-xl'>
                            Adiconar
                        </button>
                    </div>
                )
                })}
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
      {/* Header da pagina */}
        <IonHeader className='h-15'>
          <IonToolbar/>
        </IonHeader>
       { /* Corpo da pagina */}
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