import { IonContent, IonHeader, IonPage, IonToolbar, } from '@ionic/react';
import SatandardBody from '../components/SatandardBody';
import './Home.css';
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImusicsDb } from '../../../apiMusics/interfaces';
import deletar from '../../public/assets/delet.png';


const Favs: React.FC = () => {


  const queryClient = useQueryClient();

  const {data: MusicasDb = [], isLoading, isError} = useQuery<ImusicsDb[]>({
        queryKey: ['musicas'],
        queryFn: async () => {

            const token = localStorage.getItem('token');

            if (!token) throw new Error("Você precisa estar Logado");

            const res = await fetch('http://localhost:3000/api/musicas', {
                headers: { Authorization: `Bearer ${token}`}
            });

            if(!res.ok) throw new Error("Erro ao buscar músicas do usuário");

            const musicas = await res.json();
            return musicas.musicas;
        }
    });

    const deletarMusica = useMutation({
        mutationFn: async (id: number) => {
            const token = localStorage.getItem('token');

            const res = await fetch("http://localhost:3000/api/musicas", {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
                body: JSON.stringify({id}),
            });

            const json = await res.json();

            return json;
        }, 
        onSuccess: () =>  {
            alert("Música removida dos favoritos"),
            queryClient.invalidateQueries({ queryKey: ['musicas'] });
        },
        onError: () =>  alert("Erro ao remover música dos favoritos")
    }) 


    return(
    <IonPage>
     { /* Componente para decretar que existe um Header na p�gina */}
        <IonHeader className='h-15'>
          <IonToolbar/>
        </IonHeader>
        {/* Corpo da pagina */}
        <IonContent fullscreen>
          <SatandardBody>
            <div className='grid grid-cols-12 items-center text-white mt-5 border-b border-white text-sm'>
                <div className="col-span-6">Título</div>
                <div className="col-span-4">Arista</div>
                <div className="col-span-2">Deletar</div>
            </div>

            {isLoading ? <span className='text-white flex text-center items-center justify-center mt-30 text-base'>Carregando Musicas</span> : ''} 
            {isError ? <span className='text-white flex text-center items-center justify-center mt-30 text-base'>Erro ao buscar musicas</span> : ''}

            <ul className='max-h-80 overflow-y-auto  w-72'>
                    {MusicasDb.map((musica, index) => (
                        <li key={index} >
                            <div  className='grid grid-cols-12 items-center p-2 mt-2 rounded-xl w-full'>
                                <div className='col-span-4'>
                                    <div className='flex tems-center items-center'>
                                        <button className='cursor-pointer flex gap-5' aria-label='show musicPage'>
                                            <img className='rounded' src={musica.thumb} width={40} height={40} alt='thumb da musica'/>
                                            <div className='flex flex-col text-textPrimary'>
                                                < span className='text-white w-44 text-start overflow-hidden truncate text-xs'>{musica.titulo}</span>
                                                <span className='text-start text-xs'>{musica.duracao}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className='col-span-5 w-32 overflow-hidden truncate text-textPrimary text-start pt-1'>
                                    <span className='text-xs'>{musica.artista}</span>
                                </div>
                                <div className='col-span-3 text-end pr-2'>
                                    <button onClick={() => deletarMusica.mutate(musica.id) } className='cursor-pointer' aria-label='delete music'><img className='rounded w-5 h-5' src={deletar} alt='deletar musica'/></button>
                                </div> 
                            </div>
                        </li>
                    ))}
                </ul>
          </SatandardBody>
        </IonContent>
    </IonPage>
    )
}

export default Favs;