import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
const { logout } = require('../../actions/auth');

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    const authLinks = (
        <ul>
            <li>
                <NavLink to='/profiles'>
                    <i className='fa fa-users hide-sm' />{' '}
                    <span> Developers</span>
                </NavLink>
            </li>
            <li>
                <NavLink to='/posts'>
                    <i className='far fa-comment-alt hide-sm' />
                    <span> Posts</span>
                </NavLink>
            </li>
            <li>
                <NavLink to='/dashboard'>
                    <i className='fas fa-laptop-code hide-sm' />{' '}
                    <span>Dashboard</span>
                </NavLink>
            </li>
            <li>
                <a onClick={logout} href='#!'>
                    <i className='fas fa-sign-out-alt' />{' '}
                    <span className='hide-sm'>Logout</span>
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li>
                <NavLink to='/profiles'>Developers</NavLink>
            </li>
            <li>
                <NavLink to='/register'>Register</NavLink>
            </li>
            <li>
                <NavLink to='/login'>Login</NavLink>
            </li>
        </ul>
    );
    return (
        <nav className='navbar bg-dark'>
            <h1 className='main-title'>
                <NavLink to='/'>
                    <i className='fas fa-code' /> DevHub
                </NavLink>
            </h1>
            {!loading && (
                <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
            )}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
