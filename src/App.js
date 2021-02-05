// To create the app npx create-react-app name of the app
// Modal is something that is pops up for the password.
// npm i react-instagram-embed
import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [ posts, setPosts] = useState([]); // basically like creating variable
  const [open, setOpen] = useState(false);
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        //user has logged in...
        console.log(authUser);
        setUser(authUser);

      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      // this avoids overloading
      unsubscribe();
    }
  }, [user, username]);



  //useEffect -> runs a piece of code based on a specific condition
  useEffect(() => { 
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // takes the a picture whenever the anything changes fire the code
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()})));
    })

  }, []); // if blank when the page loads, but when its changed to posts it will load everytime the posts run


  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className = "app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className = "app__signup">
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = ""
              />
            </center>
              
            <Input 
              placeholder = "Username"
              type = "text"
              value = {username}
              onChange={(e) => setusername(e.target.value)}
            />

            <Input 
              placeholder="Email"
              type = "text"
              value = {email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="Password"
              type = "password"
              value = {password}
              onChange={(e) => setPassword(e.target.value)}
            />  
            <Button type="submit" onClick = {signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className = "app__signup">
            
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt = ""
              />
            </center>

            <Input 
              placeholder="Email"
              type = "text"
              value = {email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder="Password"
              type = "password"
              value = {password}
              onChange={(e) => setPassword(e.target.value)}
            />  
            <Button type="submit" onClick = {signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      <div className = "app__header">
        <div className = "app__headerImage">
          <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt = ""
          />
        </div>
          {user ? ( // This is like a if and or statement
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ): (
            <div className="app__logincontainer"> 
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          
          )}
      </div>
      
      <div className = "app__posts">
        {
          posts.map(({id, post}) => (
            <Post key ={id} postId = {id} user = {user} username = {post.username}
                  caption = {post.caption}
                  imageUrl = {post.imageUrl}/>
          ))
        }
      </div>

      {user?.displayName ? (
        <ImageUpload username = {user.displayName}/>
      ): (
        <h3>Login to upload</h3>
      )}
      
    </div>
  );
}

export default App;
