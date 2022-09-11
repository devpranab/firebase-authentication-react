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
    password: '',
    photo: '',
    error: '',
    success: false
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

  const handleChange = (e) => {
    let isFormValid = true;
    if(e.target.name === "email"){
    isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === "password"){
    const isPasswordValid = e.target.value.length > 6;
    const passwordHasNumber = /\d{1}/.test(e.target.value);
    isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
      // if true isFormValid then work this
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
  console.log(user.email, user.password);
  if(user.name && user.password){
    //console.log("Form Submitted");
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res => {
      console.log(res);
      const newUserInfo = {...user};
      newUserInfo.error = "";
      newUserInfo.success = true;
      setUser(newUserInfo);
    })
    .catch(error => {
    //Handle Errors here
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
    });
  }
  e.preventDefault();
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
    {/* create simple login form email and password */}
    <h2>Our own Authentication</h2>
  <form action="" onSubmit={handleSubmit}>
  <label htmlFor="">Your Name: </label>
    <input type="text" onChange={handleChange} name="name" placeholder="" required/>
    <br />
  <label htmlFor="">Your Email: </label>
    <input type="text" onChange={handleChange} name="email" placeholder="" required/>
    <br />
    <label htmlFor="">Your Password: </label>
    <input type="password" onChange={handleChange} name="password" placeholder="" required/>
    <br />
    <input type="submit" value="Submit" />
  </form>
  <p style={{color: "red"}}>{user.error}</p>

  {user.success && <p style={{color: "green"}}>Successfully user created!</p>}
    </div>
  );
}

export default App;