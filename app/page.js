'use client'

import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from '@/firebase';
import {Box, Modal, Typography, Stack, TextField, Button, createTheme, ThemeProvider, Divider, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import Head from 'next/head';
import styles from "./page.module.css";


export default function Home() {
  return (
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
        <h1>WHAT'S IN YOUR PANTRY?</h1>
        <p>Keep track of what’s in your pantry and generate recipes based on what’s in it.</p>
        <button>Get Started</button>
      </div>
    </div>
  );
}