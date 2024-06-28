import React,{useState} from "react";
import { authModalState } from "./authModalAtom";
import { useSetRecoilState } from 'recoil';
import {auth} from "./firebase";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import styled from '@emotion/styled';
import { authState } from "../components/authState";


const Signup = () => {

    const navigate = useNavigate();

    const [inputs,setInputs] = useState({email:"",username:"",password:""});

    const SetRecoilState = useSetRecoilState(authModalState);
    const SetRecoilStateLog = useSetRecoilState(authState);

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error
    ] =useCreateUserWithEmailAndPassword(auth);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev)=>({...prev,[e.target.name]:e.target.value}));
    }

    const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password || !inputs.password) return alert("Please fill all fields");
        try{
            const newUser = await createUserWithEmailAndPassword(inputs.email,inputs.password);
            if(error) return alert(error);
            if(!newUser) return;
            SetRecoilStateLog({"loggedIn":true,"username":inputs.email});
            navigate(`/?username=${inputs.email}`);
        } catch (e:any) {
            return alert(e.message)
        }
    }

    return <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8" onSubmit={handleRegister}>
        <div>
            <h3 className="text-black text-xl font-medium mb-4">Register to IDEasy</h3>
            <label htmlFor='Email' className="text-black font-medium block mb-2">
                Email
            </label>
            <input type="email" name="email" id="email" className="rounded-lg w-full h-10 p-2.5 border-2 outline-none mb-2 text-black" placeholder="Email" onChange={handleChange}></input>
            <label htmlFor='username' className="text-black ont-medium block mb-2">
                Username
            </label>
            <input type="username" name="username" id="username" className="rounded-lg w-full h-10 p-2.5 border-2 outline-none mb-2 text-black" placeholder="Username" onChange={handleChange}></input>
            <label htmlFor='Password' className="text-black font-medium block mb-2">
                Password
            </label>
            <input type="password" name="password" id="password" className="rounded-lg w-full h-10 p-2.5 border-2 outline-none mb-4 text-black" placeholder="Password" onChange={handleChange}
            ></input>
            <button className='bg-black w-full rounded-lg h-10 mt-3 text-white font-medium hover:bg-gray-800'>{loading ? "Registering.." : "Register"}</button>
            <button className='text-sm text-black font-medium mt-5'>
                Already Registered? {" "}
                <a href="#" className="hover:underline text-blue-700"
                onClick={()=>{
                    SetRecoilState((val)=>({...val,type:'login'}))
                }}
                >Log in</a>
            </button>
        </div>
    </form>
}

export default Signup;

