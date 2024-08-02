'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button, createTheme, ThemeProvider, Divider, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import Head from 'next/head';
import { serverTimestamp } from "firebase/firestore";






export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [filter, setFilter] = useState('newest')

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
      await setDoc(docRef, {quantity: quantity + 1, timestamp: serverTimestamp( )}, {merge: true})
    }
    else{
      await setDoc(docRef, {quantity: 1, timestamp: serverTimestamp()})
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
        await setDoc(docRef, {quantity: quantity - 1, timestamp: serverTimestamp()}, {merge: true})
      }
    }

    await updateInventory()
  }



  useEffect(() => { //runs updateInventory 
    updateInventory()
  }, []) 


  const getFilteredInventory = () => {
    let sortedInventory = [...inventory]

    switch (filter) {
      case 'alphabetical':
        sortedInventory.sort((a, b) => a.name.localCompare(b.name))
        break
    
      case 'qtyHighLow':
        sortedInventory.sort((a, b) => b.quantity - a.quantity)
        break
      
      case 'qtyLowHigh':
        sortedInventory.sort((a, b) => a.quantity - b.quantity)
        break

      case 'newest':
        sortedInventory.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
        break
      
      case 'oldest':
        sortedInventory.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
        break
      
      default:
        break
    }

    return sortedInventory
      
  }
 


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
              placeholder="Add Item"
              variant='outlined' 
              fullWidth value={itemName} 
              onChange={(e) =>{
                setItemName(e.target.value)
              }}
              />
              <Button variant="outlined" 
              sx={{bgcolor: "#426B1F", borderColor: "#426B1F", color: "white", 
              '&:hover':{bgcolor: "#76915e", borderColor: "#76915e"}}}
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
          

          <Stack mt={4} height= "500px" spacing={2} overflow="auto" >
        {
          inventory.map(({name, quantity}) => (
            <Box 
            key={name} 
            width="100%" 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            p={2}
            border = "1px solid #B3B3B3"
            borderRadius={3}
            bgcolor="white">
            
              <Typography variant="p" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Stack direction="row" spacing={2} display="flex" alignItems="center">
              <Typography variant="p" color="#333" textAlign="center" pr={4}>
                QTY: <Typography component="span" fontWeight="bold">{quantity}</Typography>
              </Typography>
              <Button 
              sx={{bgcolor: "#426B1F", borderColor: "#426B1F", color: "white",
              '&:hover':{bgcolor: "#76915e", borderColor: "#76915e"} }}
              variant="outlined" 
              onClick = {() => {
                addItem(name)
              }}
              >
                Add
              </Button>

              <Button 
              sx={{bgcolor: "#000000", borderColor: "#000000", color: "white", 
              '&:hover':{bgcolor: "#494a48", borderColor: "#494a48"}}} 
              variant="outlined" 
              onClick = {() => {
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
    </Box>
    </>
  )
}
