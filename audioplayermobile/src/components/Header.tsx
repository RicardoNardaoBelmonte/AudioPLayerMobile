import { IonButton, IonButtons, IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import hamburguer from '../../public/menu-outline.svg';
import { IHeader } from "../interfaces/interfcaes";
import logo from '../../public/assets/logo.png';

const Header: React.FC <IHeader>  = ({isOpen, setIsOpen}) => {

    function hamburguerRotate(e: React.MouseEvent<HTMLIonButtonElement>): void{
        e.preventDefault();
        setIsOpen(!isOpen);
    }

    return(<>
      <IonHeader> 
              <IonToolbar>
                <div className="relative flex items-center justify-round gap-5">
                  <div>
                    <IonButtons>
                      <IonButton className={`hamburguer transition-transform duration-300 ${ isOpen ? "rotate-180" : "-rotate-180"}`}onClick={hamburguerRotate}>
                        <IonIcon icon={hamburguer}/>
                      </IonButton>
                    </IonButtons>
                  </div>

                  <div>
                    <img className="w-10 h-10" src={logo} alt="Imagem logotipo do aplicativo"/>
                  </div>
      
                  <div className="flex">
                    <IonButtons>
                      <IonButton className="w-16 text-sm">Login</IonButton>
                      <IonButton>Register</IonButton>
                    </IonButtons>
                  </div>

                </div>
            </IonToolbar>
        </IonHeader>
</>)
  }
  
export default Header;