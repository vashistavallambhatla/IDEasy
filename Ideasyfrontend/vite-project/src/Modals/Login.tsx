import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {auth} from "./firebase";
import React,{useEffect,useState} from "react";
import {useSetRecoilState,useRecoilValue} from 'recoil';
import styled from '@emotion/styled';
import { useNavigate } from "react-router-dom";
import { authModalState } from "./authModalAtom";
import { authState } from '../components/authState';


type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {

    const SetRecoilState = useSetRecoilState(authModalState);
    const SetRecoilStateLog = useSetRecoilState(authState);


    const navigate = useNavigate();

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password) return alert("Please fill all fields");
        try{
            const newUser = await signInWithEmailAndPassword(inputs.email,inputs.password);
            if(error) alert(error.message);
            if(!newUser) return;
            SetRecoilStateLog({"loggedIn":true,"username":inputs.email});
            navigate(`/?username=${inputs.email}`);
        } catch (e:any) {
            return alert(e.message);
        }
    }

    const handleClick = (type : 'login' | 'register' | 'forgotPassword') => {
        SetRecoilState((prev)=>({...prev,type}))
    }

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev)=>({...prev,[e.target.name]:e.target.value}))
    }

    const [inputs,setInputs] = useState({email:"",password:""});

    return <form className='px-6 py-4 space-y-6' onSubmit={handleSubmit}>
    <div className='mb-4'>
        <h3 className='text-black text-xl font-large mb-4'>Sign in to Ideasy</h3>
        <label htmlFor="email" className='block mb-2 text-black font-medium text-sm'>
            Username
        </label>
        <input type="email" name="email" id="email" className="rounded-lg mb-2 w-70 block text-black h-10 w-full p-2.5 border-2 outline-none" placeholder="Username" onChange={handleChange}/>
        <label htmlFor="password" className='block mb-2 text-black font-medium text-sm'>
            Password
        </label>
        <input type="password" name="password" id="password" className="text-black rounded-lg mb-2 w-full block h-10 w-full p-2.5 border-2 outline-none" placeholder="Password" onChange={handleChange}/>
        <button type="submit" className='font-medium bg-black rounded-lg w-full h-10 mt-6 text-white font-medium hover:bg-gray-800'>Login</button>
        <button className='flex w-full justify-end' onClick={()=>handleClick("forgotPassword")}>
            <a href="#" className="text-sm block mt-5 text-black hover:underline w-full text-right">Forgot password?</a>
        </button>
        <div className='text-sm font-medium text-black mt-5'>
            Not Registered? {" "}
            <a href="#" className="hover:underline text-blue-700" onClick={()=>handleClick("register")}>
                Create account
            </a>
        </div>
    </div>
</form>
}

export default Login;