import homeApagada from '../../public/assets/homeApagada.png';
import home from '../../public/assets/home.png';
import estrela from '../../public/assets/estrela.png';
import estrelaApagada from '../../public/assets/estrelaApagada.png';
import { IonRouterLink } from '@ionic/react';
import { useLocation } from 'react-router';

const SatandardBody: React.FC<{children?: React.ReactNode}> = ({children}) => {
  
  const path = useLocation().pathname;

  const navgationLinks = [
    { name: 'Home', path: '/home', icon: homeApagada, activeIcon: home},
    { name: 'Favoritos', path: '/favs', icon: estrelaApagada, activeIcon: estrela},
  ]

  return (
    <div className="mt-15 flex flex-col justify-center items-center"  id="container">
        <div className="flex gap-5">
          {navgationLinks.map((link) => (
              <IonRouterLink  key={link.name} routerLink={link.path} className='bg-background py-2 px-5 rounded-lg border boder-borderGray'>
                <div className={`flex flex-row items-center gap-2 ${path === link.path ? 'text-white' : 'text-gray-400'}`}>
                  <img loading='lazy' className='w-4 h-4' src={path === link.path ? link.activeIcon : link.icon} alt="" />
                  {link.name}
                </div>
              </IonRouterLink>
            ))}
        </div>  

        <div className='mt-10 bg-background w-72 rounded h-[22rem] flex flex-col items-center'>
          {children}
        </div>
    </div>  
  );
};

export default SatandardBody;
