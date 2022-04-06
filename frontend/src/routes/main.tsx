import React, {FC,useState} from "react";
import { Box ,Text,Flex, Button} from "@chakra-ui/react"; 
import { mintAnimalTokenContract } from "../contracts";
import AnimalCard from "../components/AnimalCard";

interface MainProps{
    account: string;
}

const Main: FC<MainProps> =({account})=>{
    const [NewanimalType, setNewanimalType] = useState<string>();

    const onClickMint=async()=>{
        try {
            if(!account) return; //No account found

            const res=await mintAnimalTokenContract.methods
            .mintAnimalToken()
            .send({from:account});

            if(res.status){
                const balanceLength= await mintAnimalTokenContract.methods
                .balanceOf(account)
                .call();

                const animalTokenId= await mintAnimalTokenContract.methods
                .tokenOfOwnerByIndex(account,parseInt(balanceLength.length,10)-1)
                .call();

                const animalType = await mintAnimalTokenContract.methods
                .animalTypes(animalTokenId)
                .call();

                setNewanimalType(animalType);

            }
            

        } catch (error) {
            console.error(error);
            
        }
    }


    return <Flex w="full" h="100vh" justifyContent="center" alignItems="center" direction="column">
        <Box>
            {NewanimalType ? (
                <AnimalCard animalType={NewanimalType}/>
            ):(
                <Text>Let's mint Animal Card</Text>
            )}
        </Box>
        <Box>
            <Button mt={4} size="sm" colorScheme="pink" onClick={onClickMint}>Mint</Button>
        </Box>
    </Flex>
}

export default Main;