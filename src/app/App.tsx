import { useState, useEffect } from 'react';
import { Snowfall } from './components/Snowfall';
import { UserSelector } from './components/UserSelector';
import { GiftList } from './components/GiftList';

export default function App() {
  // 1. Leemos del localStorage al iniciar el estado
  // Esto evita que aparezca la pantalla de selección si ya habías elegido uno
  const [selectedUser, setSelectedUser] = useState<'Enzo' | 'Laura' | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    // Validamos que sea uno de los usuarios permitidos
    if (savedUser === 'Enzo' || savedUser === 'Laura') {
      return savedUser;
    }
    return null;
  });

  const handleSelectUser = (user: 'Enzo' | 'Laura') => {
    setSelectedUser(user);
    // 2. Guardamos la selección
    localStorage.setItem('currentUser', user);
  };

  const handleBack = () => {
    setSelectedUser(null);
    // 3. Limpiamos la selección al salir
    localStorage.removeItem('currentUser');
  };

  return (
    <>
      <Snowfall />
      {!selectedUser ? (
        <UserSelector onSelectUser={handleSelectUser} />
      ) : (
        <GiftList currentUser={selectedUser} onBack={handleBack} />
      )}
    </>
  );
}