import React,{useState,useEffect} from 'react';
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import {db} from '../firebase'
import firebase from 'firebase'
function Post({postId,user,username,caption,imageUrl}) {
    const [comments,setComments]=useState([]);//list
    const [comment,setComment]=useState('');
    useEffect(()=>{
        let unsubscribe;
        //let unsubs
        if(postId){
            unsubscribe=db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            });
        }
        return()=>{
            unsubscribe();
        }
    },[postId]);

    const postComment =(event)=>{
        event.preventDefault();
        db.collection('posts').doc('postId').collection('comments').add({
            text:comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()//allow to sort the post (recent posts to the top)
        });
        setComment('');
    }

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username} 
                    src="/static/images/avatar/1.jpg" 
                />
                <h3>{username}</h3>
            </div>
            <img 
                className='post__image'
                src={imageUrl}
                alt=""
            />
            <h4 className='post__text'><strong>{username} :</strong>{caption}</h4>
            <div className='post__comments'>
                {//adding the existing comments in the database
                //printing the user name then the comment
                    comments.map((comment)=>(
                        <p>
                            <strong>{comment.username}</strong>{comment.text}
                        </p>
                    ))
                }
            </div>
            {user &&(//form will show only if you are logged in
                <form className='post__commentbox'>
                <input
                className='post__input'
                type='text'
                placeholder='add a comment'
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                />
                <button
                className='post__button'
                disabled={!comment}
                type='submit'
                onClick={postComment}
                >
                    Post
                </button>
            </form>
            )}
            
        </div>
    )
}

export default Post
