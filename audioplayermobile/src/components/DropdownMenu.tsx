import { IDropdown } from "../interfaces/interfcaes";

const DropdownMenu: React.FC<IDropdown> = ({isOpen}) => {
    return(
        <div className={`fixed top-11 left-1 z-50 h-20 w-30 rounded border border-black bg-background p-1 transition-all duration-300 ease-in-out origin-top min-h-[10rem] min-w-[9rem]
    ${isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-y-0 invisible"}`}>
            <ul className="pt-1">
                    <li className='pl-2 pt-1 text-white'>Arquivo</li>
                    <li className='pl-2 pt-1 text-white border-[#262626] border-t-1'>Editar</li>
                    <li className='pl-2 pt-1 text-white border-[#262626] border-t-1'>Exibir</li>
                    <li className='pl-2 pt-1 text-white border-[#262626] border-t-1'>Configurações</li>
                    <li className='pl-2 pt-1 text-white border-[#262626] border-t-1'>Ajuda</li>
            </ul>
        </div>
    )
}

export default DropdownMenu;