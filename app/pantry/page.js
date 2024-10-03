'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button, createTheme, ThemeProvider, Divider, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import Head from 'next/head';
import styles from "./page.module.css";



export default function Home(){
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [filter, setFilter] = useState('added')
    const [recipe, setRecipe] = useState('');

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
          await setDoc(docRef, {quantity: quantity + 1, updatedAt: new Date()})
        }
        else{
          await setDoc(docRef, {quantity: 1, createdAt: new Date()})
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
    
    const getRecipe = async (ingredients) => {
        let r = await generateRecipe(ingredients)
        setRecipe(r) 
    }

    const handleSubmit = async () => {
        const ingredients = inventory.map(item => item.name); // Collect ingredients from the pantry
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ingredients), // Send the ingredients to the server
        });
      
        if (response.ok) {
          const data = await response.json(); // Get the response back as JSON
          setRecipe(data); // Set the recipe from the response
        } else {
          console.error('Failed to generate recipe');
        }
    };

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)


    return(
        <>
        <Head>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
        </Head>
        <div className={styles.container}>
            <div className={styles.waveContainer}>
                <img src="/wave-corner.svg" alt="Wave-corner" />
                <div className={styles.cornerContainer}>
                    <img src="/grocery-pantry.png" alt="Groceries" className={styles.cornerImage} />
                </div>
            </div>


            {/* Header */}
            <div className={styles.header}>
                <img src="logo.png" alt="logo"/>
                <a href="/pantry">
                    <h5>Your Pantry</h5>
                </a>
                <a href="/generate">
                    <h5>Generate Recipe</h5>
                </a>
            </div>

            <div className={bodyContainer}>
                {/* Add Items */}
                

                {/* Your Pantry */}



            </div>
        </div>
        </>
    )
}