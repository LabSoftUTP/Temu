import './ReviewForm.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { UserContext } from '../provider/UserContext';

function ReviewForm({ productId }) {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);

    console.log("Usuario autenticado:", user); 

    useEffect(() => {
        async function checkReview() {
            if (!user) return; 
            try {
                const response = await axios.get(`/api/reviews/check/${productId}`, {
                    params: { userId: user.id },
                });
                setHasReviewed(response.data.hasReviewed);
            } catch (error) {
                console.error(error);
            }
        }
        checkReview();
    }, [productId, user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            setMessage('Debes iniciar sesión para dejar una opinión.');
            return;
        }
        try {
            const response = await axios.post(`/api/reviews`, {
                productId,
                reviewText,
                rating,
                userId: user.id // Usar el ID del usuario autenticado
            });
            setMessage('Opinión guardada correctamente.');
            setHasReviewed(true); // Actualizar el estado después de enviar la opinión
        } catch (error) {
            console.error(error);
            setMessage('Hubo un error al guardar tu opinión. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div>
            {message && <p>{message}</p>}
            {!user ? (
                <p>Debes iniciar sesión para dejar una opinión.</p>
            ) : hasReviewed ? (
                <p>Ya has dejado una opinión sobre este producto.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Calificación de estrellas */}
                    <div className="star-rating">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                        style={{ display: 'none' }}
                                    />
                                    <FaStar
                                        size={24}
                                        color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(null)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Escribe tu opinión"
                        required
                    ></textarea>
                    <button type="submit">Enviar opinión</button>
                </form>
            )}
        </div>
    );
}

export default ReviewForm;
