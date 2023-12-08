import React, { useState } from 'react';
import { Modal, Button, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

function EditTweetModal({ show, handleClose, tweet, handleSave }) {
    const [editedContent, setEditedContent] = useState(tweet.content || '');
    const [editedImage, setEditedImage] = useState(null);
    const [editMode, setEditMode] = useState('text'); 

    const saveChanges = async () => {
        if (editMode === 'text') {
            await handleSave(tweet._id, editedContent, null);
        } else {
            await handleSave(tweet._id, null, editedImage);
        }
        handleClose();
    };

    const handleImageChange = (e) => {
        setEditedImage(e.target.files[0]);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tweet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ToggleButtonGroup type="radio" name="editMode" defaultValue="text">
                    <ToggleButton id="tbg-radio-1" value="text" onChange={() => setEditMode('text')}>
                        Text
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value="image" onChange={() => setEditMode('image')}>
                        Image
                    </ToggleButton>
                </ToggleButtonGroup>
                {editMode === 'text' ? (
                    <Form.Group className="mt-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                    </Form.Group>
                ) : (
                    <Form.Group className="mt-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveChanges}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditTweetModal;
