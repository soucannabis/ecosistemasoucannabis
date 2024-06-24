import React, { useState } from 'react';

function AlertComponent({ message, emptyFields }) {
    const [showAlert, setShowAlert] = useState(false);

    const handleShowAlert = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    return (
        <div className={`custom-alert ${showAlert ? 'show-alert' : ''}`}>
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                <b className="message">{message}</b>
                {emptyFields && (
                    <div>
                        {emptyFields}
                    </div>
                )}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    );
}

export default AlertComponent;
