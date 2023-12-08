import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button } from 'react-bootstrap';
import EditTweetModal from '../components/EditTweetModal';
import { Link } from 'react-router-dom';

function ViewTweets() {
    const currentUser = localStorage.getItem('username');
    const [editingTweet, setEditingTweet] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tweets, setTweets] = useState([]);
    const [filteredTweets, setFilteredTweets] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value.length > 0) {
            const lowerCaseTerm = event.target.value.toLowerCase();
            const filtered = tweets.filter(tweet => 
                tweet.username.toLowerCase().includes(lowerCaseTerm));
            setFilteredTweets(filtered);
        } else {
            setFilteredTweets(tweets);
        }
    };


    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5002/api/tweets/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTweets(tweets.filter(tweet => tweet._id !== id));
                setFilteredTweets(filteredTweets.filter(tweet => tweet._id !== id));
                window.location.reload()
            } else {
                console.error('Failed to delete tweet');
            }
        } catch (error) {
            console.error('Error deleting tweet:', error);
        }
    };

    const handleEdit = (tweet) => {

        setEditingTweet(tweet);
        setShowEditModal(true);
    };


    useEffect(() => {
        fetch('http://localhost:5002/api/tweets')
            .then(response => response.json())
            .then(data => {
                setTweets(data);
                setFilteredTweets(data);
            })
            .catch(error => console.error('Error fetching tweets:', error));
    }, []);

    const filterTweetsByUser = (username) => {
        const userTweets = tweets.filter(tweet => tweet.username === username);
        setFilteredTweets(userTweets);
        setSelectedUser(username); 
    };

    const clearFilter = () => {
        setFilteredTweets(tweets); 
        setSelectedUser(null); 
    };

    const renderContent = (content, tweetId) => {
        if (typeof content === 'string' && content.length > 0) {
            const imageRegex = /data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+/;
            const imageMatch = content.match(imageRegex);
            
            if (imageMatch) {
                console.log(`Rendering image for tweet ${tweetId}:`, imageMatch[0]);
                return <img src={imageMatch[0]} alt="Tweet" className="img-fluid mb-2" />;
            }
            
            return <Card.Text>{content.replace(/\r\n|\r|\n/g, " ")}</Card.Text>;
        }
        return null; 
    };

    const handleSave = async (id, content, image) => {
        console.log(`Sending update for tweet ID: ${id}`);
        console.log('Content:', content);
        console.log('Image file:', image);
    
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = (error) => reject(error);
            });
        };
        const combineContentAndImage = async (content = '', image) => {
            content = content || '';

            if (image) {
                try {
                    const base64Image = await convertToBase64(image);
                    return `${content.trim()}\n\n${base64Image}`;
                } catch (error) {
                    console.error('Error converting image to base64:', error);
                    throw error; 
                }
            } else {
                return content; 
            }
        };    
    
        const formData = new FormData();
        formData.append('content', content);
    
        if (image) {
            try {
                const base64Image = await convertToBase64(image);
                formData.append('image', base64Image);
            } catch (error) {
                console.error('Error converting image to base64:', error);
                return;
            }
        }
    
        try {
            const finalContent = await combineContentAndImage(content, image);
            const formData = new FormData();
            formData.append('content', finalContent);
    
            const response = await fetch(`http://localhost:5002/api/tweets/${id}`, {
                method: 'PATCH',
                body: formData,
            });
    
            if (response.ok) {
                const updatedTweet = await response.json();
                setTweets(tweets.map(tweet => {
                    if (tweet._id === id) {
                        return {
                            ...tweet,
                            content: updatedTweet.content, 
                            image: updatedTweet.image, 
                            updatedTime: updatedTweet.updatedTime
                        };
                    }
                    window.location.reload()
                    return tweet;
                
                }));
            } else {
                console.error('Failed to update tweet. Status:', response.status);
            }
        } catch (error) {
            console.error('Error updating tweet:', error);
        }
    };
    

    return (
        <Container className="mt-4">
            <div className="mb-3">
                <input 
                    type="text" 
                    placeholder="Search for users..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control"
                />
            </div>
            {selectedUser && (
                <div className="my-4">
                    <h2 className="d-inline-block me-3">Tweets by {selectedUser}</h2>
                    <Button variant="outline-secondary" size="sm" onClick={clearFilter}>Show all tweets</Button>
                </div>

            )}
            <ListGroup>
                {filteredTweets.map(tweet => (
                    <Card key={tweet._id} className="mb-2">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span onClick={() => filterTweetsByUser(tweet.username)}>
                                {tweet.username} - {new Date(tweet.createdTime).toLocaleString()}
                            </span>
                            {tweet.username === currentUser && (
                                <div>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        onClick={() => handleEdit(tweet)}
                                        className="me-2"  // Bootstrap class for margin end (right)
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={() => handleDelete(tweet._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </Card.Header>
                        <Card.Body onClick={() => filterTweetsByUser(tweet.username)}>
                            {renderContent(tweet.content, tweet._id)}
                        </Card.Body>
                    </Card>
                ))}
            </ListGroup>
            {showEditModal && (
                <EditTweetModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    tweet={editingTweet || {}}
                    handleSave={handleSave}
                />
            )}
        </Container>
        
    );
}

export default ViewTweets;