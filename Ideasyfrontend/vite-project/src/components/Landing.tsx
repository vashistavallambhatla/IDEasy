
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate,useSearchParams} from 'react-router-dom';
import styled from '@emotion/styled';
import {db} from "../Modals/firebase";
import {doc,setDoc,getDoc,updateDoc,arrayRemove} from 'firebase/firestore';
import { useRecoilValue } from 'recoil';
import { authState } from './authState';
import { MdDelete } from "react-icons/md";


const SLUG_WORKS = ["car", "dog", "computer", "person", "inside", "word", "for", "please", "to", "cool", "open", "source"];
const SERVICE_URL = "http://localhost:3001";


const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
`;

const StyledInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledSelect = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

function getRandomSlug() {
    let slug = "";
    for (let i = 0; i < 3; i++) {
        slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
    }
    return slug;
}

const addUserWithRepl = async (userName:string,repls:string[]) => {
  try{
    const userDocRef=doc(db,'users',userName);
    const userDoc=await getDoc(userDocRef);

    if(userDoc.exists()){
      await updateDoc(userDocRef, { repls });
    }
    else{
      await setDoc(userDocRef, { repls });
    }
    console.log(`User ${userName} added/updated with orders: ${repls}`);
  } catch(error){
    console.error("Error adding/updating document: ",error);
  }
}

const deleteReplFromUser = async (userName: string, replToDelete: string,setRepls: (repls: string[]) => void) => {
  try {
    const userDocRef = doc(db, 'users', userName);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedRepls = userData.repls.filter((repl: string) => repl !== replToDelete);

      await updateDoc(userDocRef, { repls: updatedRepls });
      console.log(`Repl ${replToDelete} deleted from user ${userName}.`);
      setRepls(updatedRepls);
    } else {
      console.log(`User ${userName} does not exist.`);
    }
  } catch (error) {
    console.error("Error deleting repl: ", error);
  }
};



export const Landing = () => {

    const recoilValue = useRecoilValue(authState);
    const [language, setLanguage] = useState("node-js");
    const [replId, setReplId] = useState(getRandomSlug());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [repls,setRepls] = useState<string []>([]);
    const [searchParams] = useSearchParams();
    const userName = searchParams.get('username') ?? recoilValue.username;

    useEffect(()=>{
      const getUserRepls = async (userName : string) => {
        try{
          const userDocRef = doc(db,'users',userName);
          const userDoc = await getDoc(userDocRef);

          if(userDoc.exists()){
            const userData = userDoc.data();
            if(userData.repls){
              setRepls(userData.repls);
            }
          }
          else{
            console.log("No such document!");
          }
        }catch (error){
          console.error("Error getting document: ",error);
        }
      }
      if(userName){
        getUserRepls(userName);
      }
    },[userName]);

    if(userName) return (
       <Container className='mt-20 font-serif'>
        <h1 className='text-3xl'>Create a new project</h1>
        <StyledInput
          className='text-black'
          onChange={(e) => setReplId(e.target.value)}
          type="text"
          placeholder="Repl ID"
          value={replId}
        />
        <StyledSelect
         className='text-black'
          name="language"
          id="language"
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="node-js">Node.js</option>
          <option value="python">Python</option>
        </StyledSelect>
        <StyledButton disabled={loading} onClick={async () => {
          const newRepls=[...repls,replId];
          setRepls(newRepls);
          addUserWithRepl(userName,newRepls);
          setLoading(true);
          await axios.post(`${SERVICE_URL}/project`, { replId, language });
          setLoading(false);
          navigate(`/coding/?replId=${replId}`)
        }}>{loading ? "Starting ..." : "Start Coding"}</StyledButton>
        {repls.length>0 &&
        <div className='mt-20'>
          <h1 className='text-3xl mb-10'>Existing projects</h1>
          {repls.map((repl,index)=>(
            <div key={index} className='flex justify-between mb-5'>
              <p className='text-xl'>{repl}</p>
              <button className=' bg-blue-700 rounded p-1 px-4'
              onClick={()=>{
                navigate(`/coding/?replId=${repl}`);
              }}
              >start</button>
              <div>
                <MdDelete className='mt-1 text-3xl text-blue-700 hover:text-white' onClick={()=>{
                  deleteReplFromUser(userName,repl,setRepls);
                }}></MdDelete>
              </div>
            </div>
          ))}
        </div>}
      </Container>
    );
    else{
      return(
        <div>
          <h1 className='flex justify-center mt-40 font-serif text-4xl'>Learn to code.</h1>
          <h1 className='flex justify-center mt-40 font-serif text-4xl'>Code to learn.</h1>
          <h1 className='flex justify-center mt-40 font-serif text-5xl'>Your Cloud Coding Playground</h1>
        </div>
      )
    }
}