import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';

function RegisterForm({ onLoginStatusChange }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5002/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                localStorage.setItem('isLoggedIn', 'true'); 
                localStorage.setItem('username', username);
                onLoginStatusChange(username);
                navigate('/'); 
            } else {
                console.log('login successful');
            }
        } catch (error) {
            console.error('login falied', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5002/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            if (response.ok) {
                await handleLogin(); 
            } else {
                console.log('register failed');
            }
        } catch (error) {
            console.error('register failed', error);
        }
    };

    return (
        <Container className="mt-4">
            <Form onSubmit={handleSubmit} className="w-50 mx-auto">
                <h2 className="mb-3">register</h2>
                <FormGroup>
                    <Label for="username">user name</Label>
                    <Input 
                        type="text" 
                        name="username" 
                        id="username"
                        placeholder="enter username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">password</Label>
                    <Input 
                        type="password" 
                        name="password" 
                        id="password"
                        placeholder="enter password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="email">E-mail</Label>
                    <Input 
                        type="email" 
                        name="email" 
                        id="email"
                        placeholder="enter e-mail address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </FormGroup>
                <Button type="submit" color="primary">register</Button>
            </Form>
        </Container>
    );
}

export default RegisterForm;
