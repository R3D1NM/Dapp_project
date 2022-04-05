// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "MintAnimalToken.sol";

contract SaleAnimalToken{
    MintAnimalToken public mintAnimalTokenAddress;

    constructor(address _mintAnimalTokenAddress){
        mintAnimalTokenAddress=MintAnimalToken(_mintAnimalTokenAddress);
    }

    mapping(uint256 => uint256) public animalTokenPrices;

    uint256[] public onSaleAnimalTokenArray;

    function setForSaleAnimalToken(uint256 _animalTokenId, uint256 _price) public{
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        require(animalTokenOwner==msg.sender,"Caller is not Animal Token Owner.");
        require(_price>0,"Price is zero or less.");
        require(animalTokenPrices[_animalTokenId]==0,"This Animal Token is already on sale.");
        require(mintAnimalTokenAddress.isApprovedForAll(animalTokenOwner,address(this)),"Animal Token Owner did not approve token.");

        animalTokenPrices[_animalTokenId]=_price;

        onSaleAnimalTokenArray.push(_animalTokenId);
    }

    function purchaseAnimalToken(uint256 _animalTokenId) public payable{
        uint256 price= animalTokenPrices[_animalTokenId];
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        require(price>0,"Animal Token not sale.");
        require(price<=msg.value,"Caller sent lower than price.");
        require(animalTokenOwner != msg.sender,"Caller is Animal Token owner.");

        payable(animalTokenOwner).transfer(msg.value);
        mintAnimalTokenAddress.safeTransferFrom(animalTokenOwner,msg.sender,_animalTokenId);
        animalTokenPrices[_animalTokenId] = 0;
        for(uint256 i = 0; i<onSaleAnimalTokenArray.length;i++){
            if(animalTokenPrices[onSaleAnimalTokenArray[i]]==0){
                onSaleAnimalTokenArray[i]=onSaleAnimalTokenArray[onSaleAnimalTokenArray.length-1];
                onSaleAnimalTokenArray.pop();
            }
        }
    }

    function getOnSaleAnimalArrayLength() view public returns(uint256){
        return onSaleAnimalTokenArray.length;
    }
}