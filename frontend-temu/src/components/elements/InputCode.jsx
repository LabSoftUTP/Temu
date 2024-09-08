import { useEffect } from 'react';
import './InputCode.css';

const InputCode = () => {
    useEffect(() => {
        // Elements
        const numberCodeForm = document.querySelector(
            '[data-number-code-form]',
        );
        const numberCodeInputs = [
            ...numberCodeForm.querySelectorAll('[data-number-code-input]'),
        ];

        // Event callbacks
        const handleInput = ({ target }) => {
            if (!target.value.length) {
                return (target.value = null);
            }

            const inputLength = target.value.length;
            let currentIndex = Number(target.dataset.numberCodeInput);

            if (inputLength > 1) {
                const inputValues = target.value.split('');

                inputValues.forEach((value, valueIndex) => {
                    const nextValueIndex = currentIndex + valueIndex;

                    if (nextValueIndex >= numberCodeInputs.length) {
                        return;
                    }

                    numberCodeInputs[nextValueIndex].value = value;
                });

                currentIndex += inputValues.length - 2;
            }

            const nextIndex = currentIndex + 1;

            if (nextIndex < numberCodeInputs.length) {
                numberCodeInputs[nextIndex].focus();
            }
        };

        const handleKeyDown = e => {
            const { code, target } = e;

            const currentIndex = Number(target.dataset.numberCodeInput);
            const previousIndex = currentIndex - 1;
            const nextIndex = currentIndex + 1;

            const hasPreviousIndex = previousIndex >= 0;
            const hasNextIndex = nextIndex <= numberCodeInputs.length - 1;

            switch (code) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    if (hasPreviousIndex) {
                        numberCodeInputs[previousIndex].focus();
                    }
                    e.preventDefault();
                    break;

                case 'ArrowRight':
                case 'ArrowDown':
                    if (hasNextIndex) {
                        numberCodeInputs[nextIndex].focus();
                    }
                    e.preventDefault();
                    break;
                case 'Backspace':
                    if (!e.target.value.length && hasPreviousIndex) {
                        numberCodeInputs[previousIndex].value = null;
                        numberCodeInputs[previousIndex].focus();
                    }
                    break;
                default:
                    break;
            }
        };

        // Event listeners
        numberCodeForm.addEventListener('input', handleInput);
        numberCodeForm.addEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="input-code-container">
            <label htmlFor="phoneCode">Código de verificación</label>

            <fieldset
                name="number-code"
                data-number-code-form
                className="input-code"
            >
                <input
                    type="number"
                    min="0"
                    max="9"
                    name="number-code-0"
                    data-number-code-input="0"
                    required
                />
                <input
                    type="number"
                    min="0"
                    max="9"
                    name="number-code-1"
                    data-number-code-input="1"
                    required
                />
                <input
                    type="number"
                    min="0"
                    max="9"
                    name="number-code-2"
                    data-number-code-input="2"
                    required
                />
                <input
                    type="number"
                    min="0"
                    max="9"
                    name="number-code-3"
                    data-number-code-input="3"
                    required
                />
                <input
                    type="number"
                    min="0"
                    max="9"
                    name="number-code-4"
                    data-number-code-input="4"
                    required
                />
            </fieldset>
        </div>
    );
};

export default InputCode;