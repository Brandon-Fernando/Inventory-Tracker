'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button, createTheme, ThemeProvider, Divider} from '@mui/material';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import Head from 'next/head';





export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => { //async = it wont block code while fetching
    const snapshot = query(collection(firestore, 'inventory')) //specifies which collection in Firestore to query
    const docs = await getDocs(snapshot) //executes the query
    const inventoryList = []
    docs.forEach((doc) =>{ //adds each to inventoryList
      inventoryList.push({
        name: doc.id,
        ...doc.data(), // ... spread syntax used to include all fields from doc data
      })
    })
    setInventory(inventoryList)
  }



  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }



  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity == 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }



  useEffect(() => { //runs updateInventory 
    updateInventory()
  }, []) 


 


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@400;700&display=swap" rel="stylesheet" />
    </Head>
    <Box 
    width="100vw" 
    height="100vh" 
    bgcolor="#FAFAF5">

      {/* title */}
      <Box 
      display="flex" 
      justifyContent="center">
        <Typography
         variant="h3" 
         color="#426B1F" 
         sx={{ fontFamily: 'Newsreader, serif', pt: 2 }}>
          Pantry Tracker
        </Typography>
      </Box>


      {/* second section */} 
      <Box
      // sx={{border: "1px solid black" }}
      m={15}
      display = "flex"
      gap={10}
      >
        {/* input form */}
        <Box width={400}>
          <Typography
          variant="h4" 
          color="#000000" 
          sx={{ fontFamily: 'Newsreader, serif'}}
          pb={1}>
          Add Items
          </Typography>
          <Divider color="B3B3B3"/>

          <Box 
          width={400}
          height={200}
          border = "1px solid #B3B3B3"
          borderRadius={3}
          mt={4}
          bgcolor ="white"
          >
            <Stack width="100%" direction="column" spacing={2} p={5}>
            <TextField 
              variant='outlined' 
              fullWidth value={itemName} 
              onChange={(e) =>{
                setItemName(e.target.value)
              }}
              />
              <Button variant="outlined" 
              sx={{bgcolor: "#426B1F", borderColor: "#426B1F", color: "white"}}
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
              }}>Add</Button>
          </Stack>
          </Box>
        </Box>
        

        {/* pantry list */}
        <Box sx={{flex: 1}}>
          <Typography
          variant="h4" 
          color="#000000" 
          sx={{ fontFamily: 'Newsreader, serif'}}
          pb={1}>
          Your Pantry
          </Typography>
          <Divider color="B3B3B3"/>
        </Box>
        
        
        

        
      </Box>
      
    </Box>


    
  
  
    
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} bgcolor="#FAFAF5">
      <Box width="800px" height="100px" display="flex" alignItems="center" justifyContent="center">
          <Typography variant ='h2' color="#333">
            Inventory Items
          </Typography>
        </Box>
      <Modal open={open} onCLose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{transform: "translate(-50%, -50%)"}}>
          <Typography variant="h6" >Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant='outlined' 
              fullWidth value={itemName} 
              onChange={(e) =>{
                setItemName(e.target.value)
              }}
              />
              <Button variant="outlined" onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
              }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant = "contained" onClick={() =>{
        handleOpen()
      }}
      >
        Add New Item
      </Button>
      
      <Box border="1px solid #333">
        
      
      <Stack width= "800px" height= "400px" spacing={2} overflow="auto">
        {
          inventory.map(({name, quantity}) => (
            <Box key={name} width="100%" display="flex" alignItems="center" justifyContent="space-between" bgColor ="#f0f0f0" padding={5} border="1px solid black">
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick = {() => {
                addItem(name)
              }}
              >
                Add
              </Button>

              <Button variant="contained" onClick = {() => {
                removeItem(name)
              }}
              >
                Remove
              </Button>
              </Stack>
            </Box>
          ))}
      </Stack>
      </Box>
    </Box>
    </>
  )
}
