import './App.css';
import { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";

// Initialize Firebase
import firebaseConfig from './firebase.config.js';
firebase.initializeApp(firebaseConfig);


function App() {
  const [user, setUser] = useState({
    isSignedIn : false,
    name: '',
    email: '',
    photo: ''
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    console.log("handleSignIn clicked");
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    });
  }

  const handleSignOut = () => {
    console.log("handleSignOut clicked");
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(signedOutUser);
      //console.log(res);
    })
    .catch(err => {

    })
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign-out</button> :
         <button onClick={handleSignIn}>Sign-in</button>
      }
    {
      user.isSignedIn && <div>
         <p>Welcome! {user.name}</p>
         <p>Your email: {user.email}</p>
         <img src={user.photo} alt=""></img>
      </div>
    }
    </div>
  );
}

export default App;