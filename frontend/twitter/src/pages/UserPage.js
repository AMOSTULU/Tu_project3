// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Card, Button } from 'react-bootstrap';
// import { getUserData, updateUserDescription } from '../api/userService';

// function UserPage({ currentUser }) {
//     const { username } = useParams();
//     const [userTweets, setUserTweets] = useState([]);
//     const [userDescription, setUserDescription] = useState('');
//     const [editingDescription, setEditingDescription] = useState(false);
//     const [newDescription, setNewDescription] = useState('');

//     useEffect(() => {
//         const fetchUserData = async () => {
//             const userData = await getUserData(username);
//             setUserTweets(userData.tweets);
//             setUserDescription(userData.description);
//         };
//         fetchUserData();
//     }, [username]);

//     const handleEditDescription = () => {
//         setEditingDescription(true);
//         setNewDescription(userDescription);
//     };

//     const handleSaveDescription = async () => {
//         await updateUserDescription(username, newDescription);
//         setUserDescription(newDescription);
//         setEditingDescription(false);
//     };

//     return (
//         <Container>
//             <Container className="py-4">
//                 <h1>{username}</h1>
//                 <p>Joined on: {/* User's join timestamp */}</p>
//                 {editingDescription ? (
//                     <>
//                         <textarea
//                             className="form-control"
//                             value={newDescription}
//                             onChange={(e) => setNewDescription(e.target.value)}
//                         />
//                         <Button className="mt-2" onClick={handleSaveDescription}>Save</Button>
//                     </>
//                 ) : (
//                     <>
//                         <p>{userDescription || 'No description'}</p>
//                         {currentUser === username && (
//                             <Button onClick={handleEditDescription}>Edit Description</Button>
//                         )}
//                     </>
//                 )}
//             </Container>
//             {userTweets.map((tweet) => (
//             <Card key={tweet._id} className="mb-2">
//                 <Card.Header className="d-flex justify-content-between align-items-center">
//                 <span>
//                     {tweet.username} - {new Date(tweet.createdTime).toLocaleString()}
//                 </span>
//                 // Other code...
//                 </Card.Header>
//                 <Card.Body>
//                 {renderContent(tweet.content, tweet._id)}
//                 </Card.Body>
//             </Card>
//             ))}

//         </Container>
//     );
// }

// export default UserPage;
