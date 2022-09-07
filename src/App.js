import './App.css';
import firebase from "firebase/app";
import "firebase/auth";

// Initialize Firebase
import firebaseConfig from './firebaseConfig';
firebase.initializeApp(firebaseConfig);


function App() {

  return (
    <div className="App">
    <button>Sign-in</button>
    </div>
  );
}

export default App;