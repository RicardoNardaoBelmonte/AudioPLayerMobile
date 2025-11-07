import { IonButton } from "@ionic/react";
import { IModal } from "../interfaces/interfcaes";

const Modal: React.FC<IModal> = ({children, isOpen, closed}) => {

    if(!isOpen) return null;

    return(
        <div className="fixed bg-black/60 inset-0 z-50 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center bg-background border-borderGray border rounded-lg relative w-72 h-[25rem]  overflow-y-auto">
                <IonButton className="text-gray-400 absolute top-1 right-0" onClick={closed}>X</IonButton>
                {children}
            </div>
        </div>
    )
}

export default Modal;