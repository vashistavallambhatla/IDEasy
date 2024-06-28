import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { authState } from './authState';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { auth } from "../Modals/firebase";
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Topbar = () => {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authState);
  const recoilValue = useRecoilValue(authState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({ loggedIn: true, username: user.email as string});
      } else {
        setAuthState({ loggedIn: false, username: "" });
      }
    });
    return () => unsubscribe(); 
  }, [setAuthState]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthState({ loggedIn: false, username: "" });
      navigate("/");
    } catch (error) {
      console.log('Error signing out: ', error);
      alert("Error signing out, please try again.");
    }
  }

  
  return (
    <Container className='font-serif'>
      <h1 className='text-2xl'>IDEasy</h1>
      {
        !recoilValue.loggedIn && 
        <button 
          className='rounded bg-blue-700 p-2 px-4'
          onClick={() => {
            navigate("/getin");
          }}
        >
          Sign In
        </button>
      }
      {
        recoilValue.loggedIn && 
        <button 
          className='rounded bg-blue-700 p-2 px-4'
          onClick={handleLogout} // Call handleLogout directly
        >
          Sign Out
        </button>
      }
    </Container>
  );
};