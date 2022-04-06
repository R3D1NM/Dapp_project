import { Flex, Button, Grid, Text } from "@chakra-ui/react";
import React, { FC,useEffect ,useState} from "react";
import AnimalCard from "../components/AnimalCard";
import MyAnimalCard, { IMyAnimalCard } from "../components/MyAnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenAddress, saleAnimalTokenContract } from "../contracts";

interface MyAnimalProps{
    account: string;
}

const MyAnimal:FC<MyAnimalProps>=({account})=>{
    const [AnimalCardArray, setAnimalCardArray] = useState<IMyAnimalCard[]>();
    const [SaleStatus, setSaleStatus] = useState<boolean>(false)

    const getAnimalTokens=async()=>{
        try {
            const balanceLength= await mintAnimalTokenContract.methods
                .balanceOf(account)
                .call();

            const tempAnimalCardArray=[];
            
            for (let i = 0; i < parseInt(balanceLength,10); i++) {
                const animalTokenId= await mintAnimalTokenContract.methods
                .tokenOfOwnerByIndex(account,i)
                .call()

                const animalType = await mintAnimalTokenContract.methods
                .animalTypes(animalTokenId)
                .call();
                
                const animalPrice = await saleAnimalTokenContract.methods
                .animalTokenPrices(animalTokenId)
                .call();

                tempAnimalCardArray.push({animalTokenId,animalType,animalPrice});
            }

            setAnimalCardArray(tempAnimalCardArray);
        } catch (error) {
            console.error(error);
        }
    }

    const getIsApprovedForAll=async()=>{
        try {
            const res = await mintAnimalTokenContract.methods
            .isApprovedForAll(account,saleAnimalTokenAddress)
            .call()

            if(res){
                setSaleStatus(res);
            }
            
        } catch (error) {
            console.error(error);
            
        }
    }

    const onClickApproveToggle=async()=>{
        try {
            if(!account) return; //No account found
            
            const res = await mintAnimalTokenContract.methods
            .setApprovalForAll(saleAnimalTokenAddress,!SaleStatus)
            .send({from:account});

            if(res.status){
                setSaleStatus(!SaleStatus);
            }

        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(() => {
        if(!account) return; //No account found

        getIsApprovedForAll();
        getAnimalTokens();
    }, [account])

    

    return(
    <>
        <Flex alignItems="center">
            <Text display="inline-block">Sale Status : {SaleStatus?"True":"False"}</Text>
            <Button size="xs" ml={2} colorScheme={SaleStatus?"red":"blue"} onClick={onClickApproveToggle}>
                {SaleStatus?"Cancel":"Approve"}
            </Button>
        </Flex>

        <Grid templateColumns="repeat(4,1fr)" gap={8} mt={4}>
            {
                AnimalCardArray && AnimalCardArray.map((val,idx)=>{
                    return <MyAnimalCard 
                            key={idx} 
                            animalTokenId={val.animalTokenId} 
                            animalType={val.animalType}
                            animalPrice={val.animalPrice}
                            saleStatus={SaleStatus}
                            account={account}
                            />
                })
            }
        </Grid>
    </> 
    )
}

export default MyAnimal;