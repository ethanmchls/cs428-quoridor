import React, { memo } from 'react';
import './header.css';
import pawnLogo from './pawn.png';

export const PATH = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    GAME: '/game',
};

/*
* Centered header component with links to github, contact, and about
*/
export const Header = memo(({currentPath}) => {
    return (
        <div className={'header'}>
            <div className={'header-content'}>
                <img src={pawnLogo} className={'logo'} alt=""/>
                <a href="/" className={'header-link'}>
                    Home
                </a>
                { currentPath === PATH.ABOUT && (
                    <>
                        <p className={'header-link'}>/</p>
                        <a href="/about" className={'header-link'}>About</a>
                    </>
                )}
                { currentPath === PATH.CONTACT && (
                    <>
                        <p className={'header-link'}>/</p>
                        <a href="/contact" className={'header-link'}>Contact</a>
                    </>
                )}
                { currentPath === PATH.GAME && (
                    <>
                        <p className={'header-link'}>/</p>
                        <div className={'header-link'}>Game</div>
                    </>
                )}
            </div>
        </div>
    );
});