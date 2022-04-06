import React, { FC,useEffect ,useState} from "react";
import Main from "./routes/main";
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import Layout from "./components/Layout";
import MyAnimal from "./routes/my-animal";
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


  

  return (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Main account={Account}/>} />
        <Route path="my-animal" element={<MyAnimal account={Account}/>}/>
      </Routes>
    </Layout> 
  </BrowserRouter>);
};

export default App;
