import React,{useState} from 'react'
import {Button} from "@material-ui/core"
import {db,storage} from '../firebase'
import firebase from 'firebase'

function ImageUpload({username}) {
    const [caption,setCaption]=useState(null)
    const [progress,setProgress]=useState(0)
    const [image,setImage]=useState('')

    const handleChange=(e)=>{
        if(e.target.files[0]){//get the first file u selected
            setImage(e.target.files[0]);
        
        }
    }
    const handleUpload=()=>{
        const uploadTask= storage.ref(`images/${image.name}`).put(image);//uploading the picture to firebase

        uploadTask.on(//get a download link and use it 
            'state_changed',//listen to
            (snapshot)=>{
                //progress  function
                const progress =Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress)
            },
            (error)=>{
                //error function
                console.log(error);
                alert(error.message);
            },
            ()=>{//complet function
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {//do stuf with the link
                    //post image
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),//allow to sort the post (recent posts to the top)
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    //when we finish we reset
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                    
                });
            }
        );//uplaod task
    };//handle uplaod

    return ( 
        <div className='imageupload'>
            
            <progress className='imageupload__progress' value={progress} max='100'/>{/* progress bar*/}
            <input type='text' placeholder='enter a caption...' onChange={event=>setCaption(event.target.value)}  />{/*addingt the caption */}
            <input type='file' onClick={handleChange}/>{/* choosing the picture */}
            <Button onClick={handleUpload}>upload</Button>{/* upload button*/}
        </div>
    )
}

export default ImageUpload
