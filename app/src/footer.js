import React, { memo } from 'react';
import githubLogo from './github-mark.svg';
import './footer.css';

/*
* Centered footer component with links to github, contact, and about
*/
export const Footer = memo(() => {
    return (
        <div className={'footer'}>
            <div className={'footer-content'}>
                <a href="https://github.com/ethanmchls/cs428-quoridor" className={'footer-link'}>
                    <img src={githubLogo} className={'githublogo'} alt=""/>
                </a>
                <p className={'footer-link'}>|</p>
                <a href="mailto:samolausson@gmail.com" className={'footer-link'}>contact</a>
                <p className={'footer-link'}>|</p>
                <a href="/about" className={'footer-link'}>about</a>
            </div>
        </div>
    );
});