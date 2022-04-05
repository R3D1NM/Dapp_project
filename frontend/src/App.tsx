import React, { FC,useEffect ,useState} from "react";
import Main from "./routes/main";
import {BrowserRouter, Routes,Route} from 'react-router-dom';
const App: FC = () => {

  const [Account, setAccount] = useState<string>("");

  const getAccount =async () => {
    try{
      if(window.ethereum){
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
      } else{
        alert("Install METAMASK!")
      }
    }catch(err){
    console.error(err);

    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  useEffect(() => {
    console.log(Account);
    
  }, [Account])
  
  

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main/>} />
    </Routes>
  </BrowserRouter>;
};

export default App;
