import React from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@/lib/theme';

const Toast: React.FC = () => {
  const theme = useTheme();

  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={true}
      closeOnClick={true}
      closeButton={false}
      draggable={false}
      pauseOnHover={true}
      theme={theme}
      transition={Bounce}
    />
  );
};

export default Toast;
