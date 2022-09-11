import './App.css';
import { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";

// Initialize Firebase
import firebaseConfig from './firebase.config.js';
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn : false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  });



  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = () => {
    //console.log("handleSignIn clicked");
    firebase.auth().signInWithPopup(googleProvider)
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

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider)
    .then(function(result){
      const user = result.user;
      console.log("fb user after sign in:", user);
    })
    .catch(function(error){

    })
  }

  const handleSignOut = () => {
    //console.log("handleSignOut clicked");
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
  //console.log(user.email, user.password);
  if(newUser && user.email && user.password){
    //console.log("Form Submitted");
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res => {
      console.log(res);
      const newUserInfo = {...user};
      newUserInfo.error = "";
      newUserInfo.success = true;
      setUser(newUserInfo);
      updateUserName(user.name);
    })
    .catch(error => {
    //Handle Errors here
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
    });
  }
  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
      newUserInfo.error = "";
      newUserInfo.success = true;
      setUser(newUserInfo);
      console.log("sign in user info:", res.user);
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

const updateUserName = name => {
  const user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: name
  })
  .then(function(){
    console.log("user name updated!");
  })
  .catch(function(error){
    console.log(error);
  })
}

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign-out</button> :
         <button onClick={handleSignIn}>Sign-in</button>
      }
      <br />
      <button onClick={handleFbSignIn}>Sign-in with Facebook</button>
    {
      user.isSignedIn && <div>
         <p>Welcome! {user.name}</p>
         <p>Your email: {user.email}</p>
         <img src={user.photo} alt=""></img>
      </div>
    }
    {/* create simple login form email and password */}
    <h2>Our own Firebase Authentication</h2>
    <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser"/>
    <label htmlFor="newUser">New User Sign up</label>
  <form action="" onSubmit={handleSubmit}>
  {
    newUser && 
    <input type="text" onChange={handleChange} name="name" placeholder="your name" required/>
  }
    <br />
    <input type="text" onChange={handleChange} name="email" placeholder="your email" required/>
    <br />
    <input type="password" onChange={handleChange} name="password" placeholder="your passwor" required/>
    <br />
    <input type="submit" value={newUser ? "Sign-up" : "Sign-in"} />
  </form>
  <p style={{color: "red"}}>{user.error}</p>

  {user.success && <p style={{color: "blue"}}>Successfully user {newUser ? "created" : "logged in"}!</p>}
    </div>
  );
}

export default App;