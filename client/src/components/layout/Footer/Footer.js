import React from 'react';
import { NavLink } from 'react-router-dom';

import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
} from 'react-icons/fa';

import './Footer.css';

const Footer = () => (
    <div className='footer-container'>
        <div className='footer-upper'>
            <div className='contact-form'>
                <h1 className='main-title'>
                    <i className='fas fa-code' /> DevHub
                </h1>
            </div>
            <div className='footer-section'>
                <div>
                    <h4 className='list-heading'>Discover</h4>
                    <ul className='list'>
                        <li className='mb'>
                            <NavLink className='list-link' to='/profiles'>
                                Profiles!
                            </NavLink>
                        </li>
                        <li className='mb'>
                            <NavLink className='list-link' to='/dashboard'>
                                Dashboard
                            </NavLink>
                        </li>
                        <li className='mb'>
                            <NavLink to='/open-tender' className='posts'>
                                Posts!
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className='list-heading'>Get Started</h4>
                    <ul className='list'>
                        <li className='mb'>
                            <NavLink to='/login' className='list-link'>
                                Login
                            </NavLink>
                        </li>
                        <li className='mb'>
                            <NavLink className='list-link' to='/register'>
                                Register
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='footer-bottom'>
            <div className='footer-bottom-section'>
                <span className='copyright'>
                    &copy; DevHub 2020. All Rights Reserved.
                </span>
                <div className='tp'>
                    <NavLink to='/privacy-policy' className='links'>
                        <span
                            className='hover-underline'
                            onClick={() => window.scrollTo(500, 0)}
                        >
                            Privacy
                        </span>
                    </NavLink>
                    <NavLink to='/terms-and-conditions' className='links'>
                        <span
                            className='hover-underline'
                            onClick={() => window.scrollTo(500, 0)}
                        >
                            Terms
                        </span>
                    </NavLink>
                </div>
                <div className='social'>
                    <a
                        className='social-link'
                        href='https://www.facebook.com/etender'
                        target='blank'
                    >
                        <FaFacebookF />
                    </a>
                    <a
                        className='social-link'
                        target='blank'
                        href='https://twitter.com/etender'
                    >
                        <FaTwitter />
                    </a>
                    <a
                        className='social-link'
                        target='blank'
                        href='https://www.instagram.com/etender'
                    >
                        <FaInstagram />
                    </a>
                    <a
                        className='social-link'
                        target='blank'
                        href='https://pk.linkedin.com/etender'
                    >
                        <FaLinkedinIn />
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default Footer;
