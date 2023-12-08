import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, FormGroup, Label, Input } from 'reactstrap';

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}


function NewEntryPage() {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [postType, setPostType] = useState('text'); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalContent = '';
        const formData = new FormData();

        if (postType === 'image' && image) {
            try {
                finalContent = await convertToBase64(image);
            } catch (error) {
                console.error('Error converting image to base64:', error);
                return;
            }
        } else {
            finalContent = content;
        }

        formData.append('username', localStorage.getItem('username'));
        formData.append('content', finalContent);
    
        try {
            const response = await fetch('http://localhost:5002/api/tweets', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                navigate('/'); 
            } else {
                console.error('Failed to send tweet');
            }
        } catch (error) {
            console.error('Error sending tweet:', error);
        }
    };
    

    return (
        <Container className="mt-4">
            <Form onSubmit={handleSubmit}>
                {}
                {postType === 'text' ? (
                    <FormGroup>
                        <Label for="content">Content</Label>
                        <Input
                            type="textarea"
                            name="content"
                            id="content"
                            placeholder="What's happening?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </FormGroup>
                ) : (
                    <FormGroup>
                        <Label for="image">Image</Label>
                        <Input
                            type="file"
                            name="image"
                            id="image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </FormGroup>
                )}
                {}
                <FormGroup>
                    <Button onClick={() => setPostType('text')} active={postType === 'text'}>Text</Button>
                    <Button onClick={() => setPostType('image')} active={postType === 'image'}>Image</Button>
                </FormGroup>
                <Button type="submit" color="primary">Tweet</Button>
            </Form>
        </Container>
    );
}

export default NewEntryPage;
