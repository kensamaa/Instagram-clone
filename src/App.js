import React,{useState,useEffect} from 'react';
import Post from './components/Post'
import './App.css';
import {db,auth} from './firebase'//get from the firebase config
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Button,Input} from "@material-ui/core"
import ImageUpload from './components/ImageUpload'
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

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
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts] = useState([]); //making of the post
  const[open,setOpen]=useState(false);
  const[openSignIn,setOpenSignIn]=useState(false)
  const[username,setUsername]=useState('');//for the setting of the sign up
  const[password,setPassword]=useState('');
  const[email,setEmail]=useState('');
  const [user,setUser]=useState(null)

    //use effect runs a piece of code depends on a condition

    useEffect(()=>{
      const unsubscribe=auth.onAuthStateChanged((authUser)=>{//stay logged in even after refrech
        if(authUser){//if user is logged in
          console.log(authUser);
          setUser(authUser);
        }
        else{//user logged out
          setUser(null)
        }
      })
      return ()=>{
        //perform cleanup
        unsubscribe();
      }
    },[user,username])//anytime they change they have to be fired up

    useEffect(()=>{//this one is for new added posts
      db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
        
        //every time a new post added ,the code fires
        setPosts(snapshot.docs.map(doc=>({
          id:doc.id,
          post:doc.data()
          
        })))//get the data from firestore and add it to the stat
      })
    },[]);//[] means the code will run once the website is reloaded

    const signup=(event)=>{
      event.preventDefault();//so it wont refrech
      auth.createUserWithEmailAndPassword(email,password)//signup using fierbase auth
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName:username//added to firebase data base with th user
        })
      })
      .catch((error)=>alert(error.message))
      setOpen(false)//close the modal
    }
    const signIn=(event)=>{
      event.preventDefault();//so it wont refrech
      auth.signInWithEmailAndPassword(email,password)
      .catch((error)=>alert(error.message))

      setOpenSignIn(false)//close the modal
    }

    
  return (
    <div className="app">
      
      
    
      
       <Modal  
        open={open}
        onClose={()=>setOpen(false)}
        
      >
        <div style={modalStyle} className={classes.paper}>
          {/*what gonna be showen inside the modal */}
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signup}>sign up</Button>
            
          </form>
        </div>
        
      </Modal>
      <Modal  
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        
      >
        <div style={modalStyle} className={classes.paper}>
          {/*what gonna be showen inside the modal */}
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
            
          </form>
        </div>
        
      </Modal>
      <div className='app__header'>
        <img
          className='app__headerimage'
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
        
        {
        user ?(//if logged in
          <Button onClick={()=>auth.signOut()}>log out</Button>
        ):(//if not logged in 
          <div className="app__logincontainer">
            <Button onClick={()=>setOpen(true)}>sign In</Button>
            <Button onClick={()=>setOpen(true)}>sign up</Button>
          </div>
        )
        }
      </div>

      {
      user?.displayName ?(//if the user is loggedd in
        <center className='app__imagUpload'><ImageUpload username={user.displayName}/></center>
      ):(//else
        <h3>sorry you need to log in</h3>
      )
    } 
      
      
      <center><h1>hello this is my instagram clone</h1></center>
      {/*old way
      <Post username="Kensama" caption="this shit is cool" imageUrl="https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png" />
      <Post username="Amine" caption="so dope" imageUrl="https://cdn.mos.cms.futurecdn.net/QjuZKXnkLQgsYsL98uhL9X-1200-80.jpg"/>
      <Post username="Imane" caption="so fucking cool" imageUrl="https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg"/>
      */}
      <div className='app__posts'>
        <div className='app__postLeft'>
          {/*using state */}
          {
            posts.map(({id,post})=>(
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>
      
        <div className='app__postRight'>
          <InstagramEmbed
            url='https://www.instagram.com/p/BnNWOKfH_YL/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      
    </div>
  );
}

export default App;
