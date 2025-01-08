import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-footer text-black text-center p-4">
            <p>&copy; {currentYear} glasswhisper. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
