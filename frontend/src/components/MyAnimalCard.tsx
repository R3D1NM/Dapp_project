import { Flex, Button, Grid, Text, Box, InputGroup, Input, InputRightAddon } from "@chakra-ui/react";
import React, { ChangeEvent, FC,useEffect ,useState} from "react";
import { saleAnimalTokenContract, web3 } from "../contracts";
import AnimalCard from "./AnimalCard";

export interface IMyAnimalCard{
    animalTokenId: string;
    animalType: string;
    animalPrice: string;
}

interface MyAnimalCardProps extends IMyAnimalCard{
    saleStatus:boolean;
    account:string;
}

const MyAnimalCard:FC<MyAnimalCardProps>=({
    animalTokenId,
    animalType,
    animalPrice,
    saleStatus,
    account,
})=>{

    const [SellPrice, setSellPrice] = useState<string>("");
    const [MyAnimalPrice, setMyAnimalPrice] = useState<string>(animalPrice)

    const onChangeSellPrice=(e:ChangeEvent<HTMLInputElement>)=>{
        setSellPrice(e.target.value);
    }

    const onClickSell=async()=>{
        try {
            if(!account || !saleStatus) return;

            const res=await saleAnimalTokenContract.methods
            .setForSaleAnimalToken(animalTokenId,web3.utils.toWei(SellPrice,"ether"))
            .send({from:account});

            if(res.status){
                setMyAnimalPrice(web3.utils.toWei(SellPrice,"ether"));
                
            }
        } catch (error) {
            console.error(error);
            
        }
    }

    return(
        <Box textAlign="center" w={150}>
            <AnimalCard animalType={animalType}/>
            <Box mt={2}>
                {MyAnimalPrice==="0"?(
                <>
                    <InputGroup>
                        <Input type="number" value={SellPrice} onChange={onChangeSellPrice}/>
                        <InputRightAddon children="Matic"/>
                    </InputGroup>
                    <Button size="sm" colorScheme="pink" mt={2} onClick={onClickSell}>Sell</Button>
                </>
                ):(
                <Text d="inline-block">
                    {web3.utils.fromWei(MyAnimalPrice)} Matic
                </Text>
                )}
            </Box>
        </Box>
    )
}

export default MyAnimalCard;