import React, { useEffect } from 'react';
import {IoClose} from "react-icons/io5";
import Login from "./Login";
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import {useSetRecoilState,useRecoilValue} from 'recoil';
import { authModalState } from './authModalAtom';
import { useNavigate } from 'react-router-dom';

type AuthModalProps = {
    
};

const AuthModal:React.FC<AuthModalProps> = () => {
    const setAuthModalState=useSetRecoilState(authModalState);
	const authState=useRecoilValue(authModalState);
	const navigate=useNavigate();
	const closeModal=useCloseModal();
    return <>
	<div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60'></div>
	<div className='w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex justify-center items-center'>
		<div className='relative w-full h-full mx-auto flex items-center justify-center'>
			<div className='bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-brand-orange to-slate-900 mx-6'>
				<div className='flex justify-end p-2'>
					{(authState.type==="forgotPassword" || authState.type==="register") && <button
						type='button'
						className='bg-black rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-500 hover:text-white text-white' onClick={closeModal}>
						<IoClose className="h-5 w-5"/>
					</button>}
				    {authState.type==="login" && <button
						type='button'
						className='bg-black rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-500 hover:text-white text-white' onClick={()=>{
							navigate("/");
						}}>
						<IoClose className="h-5 w-5"/>
					</button>}
				</div>
                {authState.type==='login' ? <Login/> : authState.type==='register' ? <Signup/> : <ResetPassword/>}
			</div>
		</div>
	</div>
	</>
}
export default AuthModal;

function useCloseModal(){

	const SetAuthModal=useSetRecoilState(authModalState);

	const closeModal = () =>{
		SetAuthModal((prev)=>({...prev,isOpen:false,type:'login'}))
	}

    useEffect(()=>{
		const handleEsc = (e:KeyboardEvent) =>{
			if(e.key==='Escape') closeModal();
		};
		window.addEventListener("keydown",handleEsc);
		return ()=> window.removeEventListener("keydown",handleEsc);
	},[])

	return closeModal;
}