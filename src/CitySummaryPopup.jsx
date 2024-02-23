import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import './CitySummaryPopup.css';

Modal.setAppElement('#root');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.5)'; // semitransparent
Modal.defaultStyles.overlay.display = 'flex';
Modal.defaultStyles.overlay.justifyContent = 'center';
Modal.defaultStyles.overlay.alignItems = 'center';

function CitySummaryPopup({ cityId }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchSummary = async () => {

        setIsLoading(true); // Start loading

        const cityDetails = JSON.parse(localStorage.getItem(cityId));
        if (!cityDetails) {
            console.log('No city details found');
            return;
        }

        const messages = [
            {
                "role": "system",
                "content": "Summarize the info of the city provided and also recommend top 3 attractions of that city, summarize so you don't use more than 500 characters."
            },
            {
                "role": "user",
                "content": cityDetails.name 
            }
        ];

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` // Use your API key here
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: messages,
                    temperature: 1,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch summary');
            }

            const data = await response.json();
            // Assumes that the last message of the wizard contains the summary.
            const summary = data.choices[0].message.content;
            setSummary(summary);
        } catch (error) {
            console.error('Error fetching summary:', error);
            setSummary('Error fetching summary. Please try again.');
        }
        setIsLoading(false); // Stops loading once the request is completed
    };

    const cityDetails = JSON.parse(localStorage.getItem(cityId));
    const imageUrl = cityDetails.image;


    const openModal = () => {
        setModalIsOpen(true);
        fetchSummary();
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" size="small" onClick={openModal}>Summarize with AI</Button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="City Summary"
                className="modalContent"
                overlayClassName="modalOverlay"
            >
                <h2 className="modalHeader">{cityDetails.name}</h2>
                {imageUrl && <img src={imageUrl} alt={cityDetails.name} className="cityImage" style={{ maxWidth: '100%', borderRadius: '10px' }} />}
                {isLoading ? (
                    <p className="modalText">Generating summary, please wait...</p>
                ) : (
                    <p className="modalText">{summary || 'Summary not available.'}</p>
                )}
                <Button variant="contained" color="primary" onClick={closeModal} className="closeButton" size="large">Close</Button>
            </Modal>

        </div>
    );
}

export default CitySummaryPopup;
