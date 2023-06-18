import React, { useState, useRef } from 'react';

// import {  } from "firebase/auth";
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './App.css';

firebase.initializeApp({
    apiKey: 'AIzaSyANuXI2E1S3EVqtQ-u_vWX52Xm8PVTW4wU',
    authDomain: 'react-firebase-1b58d.firebaseapp.com',
    projectId: 'react-firebase-1b58d',
    storageBucket: 'react-firebase-1b58d.appspot.com',
    messagingSenderId: '193574297711',
    appId: '1:193574297711:web:de4e1aa11a2b0042f8ed9a',
    measurementId: 'G-JXP5HWJL54',
});

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = getAnalytics(app);

function App() {
    const [user] = useAuthState(auth);
    return (
        <div className="App">
            {/* <header className="App-header">
        
      </header> */}
            <section>{user ? <ChatRoom /> : <SignIn />}</section>
        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };
    return <button onClick={signInWithGoogle}>Sign In With Google</button>;
}

function SignOut() {
    return (
        auth.currentUser && (
            <button onClick={() => auth.signOut()}>Sign Out</button>
        )
    );
}

function ChatRoom() {
    const messagesRef = firestore.collection('messages');
    console.log(messagesRef);
    const query = messagesRef.orderBy('createdAt').limit(25);
    console.log(query);
    const [messages] = useCollectionData(query, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
    const dummy = useRef();
    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser;
        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <main>
                <div>
                    <SignOut />
                </div>
                {messages &&
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                <div ref={dummy} />
            </main>
            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message || {};
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
    console.log(props.message.text);
    console.log(text);
    // const messageClass = uid === auth.currentUser.uid ?
    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL} />
            <p>{text}</p>
        </div>
    );
    // return null;
}

export default App;
