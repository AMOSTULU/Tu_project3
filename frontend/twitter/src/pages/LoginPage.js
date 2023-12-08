import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5002/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(username); 
                localStorage.setItem('isLoggedIn', 'true'); 
                localStorage.setItem('username', username); 
                navigate('/'); 
            } else {
                alert('login failed'); 
            }
        } catch (error) {
            alert('login falied'); 
            console.error('login falied', error);
        }
    };

    return (
        <Container className="mt-4">
            <Form onSubmit={handleSubmit} className="w-50 mx-auto">
                <h2 className="mb-3">login</h2>
                <FormGroup>
                    <Label for="username">username</Label>
                    <Input 
                        type="text" 
                        name="username" 
                        id="username"
                        placeholder="enter user name" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input 
                        type="password" 
                        name="password" 
                        id="password"
                        placeholder="enter password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </FormGroup>
                <Button type="submit" color="primary">login</Button>
            </Form>
        </Container>
    );
}

export default Login;