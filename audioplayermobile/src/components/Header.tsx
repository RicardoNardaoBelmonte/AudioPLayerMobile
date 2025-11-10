import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import hamburguer from '../../public/menu-outline.svg';
import { IHeader } from "../interfaces/interfcaes";
import logo from '../../public/assets/logo.png';
import { useAuth } from "../hooks/useAuth";

const Header: React.FC<Omit<IHeader, 'nome' | 'setNome'>> = ({ isOpen, setIsOpen, setVisibleFormUsuarios, setTipoFormUsuarios, setIsLogged}) => {
  const { token, nome, setToken, setNome } = useAuth(); // usamos o contexto global

  function hamburguerRotate(e: React.MouseEvent<HTMLIonButtonElement>) {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  function handleLogout(e: React.MouseEvent<HTMLIonButtonElement>) {
    e.preventDefault();
    setToken(null);
    setNome("");
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    alert("Usuário deslogado com sucesso!");
    setIsLogged(false);
  }

  return (
    <IonHeader>
      <IonToolbar>
        <div className="grid grid-cols-3 items-center w-full h-15">
          <div className="flex justify-start ml-2">
            <IonButtons>
              <IonButton
                aria-label="Botão Hamburguer"
                className={`hamburguer transition-transform duration-300 ${isOpen ? "rotate-180" : "-rotate-180"}`}
                onClick={hamburguerRotate}
              >
                <IonIcon className="w-8 h-8" icon={hamburguer} />
              </IonButton>
            </IonButtons>
          </div>

          <div className="logo">
            <img loading="lazy" className="w-10 h-10" src={logo} alt="Imagem logotipo do aplicativo" />
          </div>

          <div className="flex justify-end mr-1">
            {token ? (
              <IonButtons class="flex gap-1">
                <span className="text-sm capitalize bg-background p-1 px-2 border border-borderGray rounded h-8 text-white">{nome}</span>
                <IonButton
                  aria-label="Sair"
                  className="text-xs capitalize rounded bg-red-500 w-15"
                  onClick={handleLogout}
                >
                  Sair
                </IonButton>
              </IonButtons>
            ) : (
              <IonButtons class="flex gap-1">
                <IonButton
                  aria-label="Logar"
                  className="text-black loginBtn text-xs capitalize bg-primary border border-black rounded w-12"
                  onClick={() => { setVisibleFormUsuarios(true); setTipoFormUsuarios('Logar') }}
                >
                  Logar
                </IonButton>
                <IonButton
                  aria-label="Registrar"
                  className="text-black registerBtn text-xs capitalize border border-black rounded bg-green-500 w-17"
                  onClick={() => { setVisibleFormUsuarios(true); setTipoFormUsuarios('Registrar') }}
                >
                  Registrar
                </IonButton>
              </IonButtons>
            )}
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  )
}

export default Header;
