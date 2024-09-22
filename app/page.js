'use client'

import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button, createTheme, ThemeProvider, Divider, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import Head from 'next/head';
import styles from "./page.module.css";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: '400', 
  subsets: ['latin'], 
  display: 'swap',
});


export default function Home() {
  return (
    <>
    <head>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
    </head>
    <div className={styles.container}>
      <div className={styles.waveContainer}>
        <img src="/wave.svg" alt="Wave" className={styles.wave} />
      </div>
      {/* Header */}
      <div className={styles.header}>
        <img src="logo.png" alt="logo"/>
        <h5>Your Pantry</h5>
        <h5>Generate Recipe</h5>
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <h1 style={{fontFamily: playfair.style.fontFamily}}>WHAT'S IN YOUR PANTRY?</h1>
        <p>Keep track of what’s in your pantry and generate recipes based on what’s in it.</p>
        <button>Get Started</button>
      </div>
    </div>
    </>
  );
}