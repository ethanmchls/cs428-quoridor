import React, { memo } from 'react';
import githubLogo from './github-mark.svg';

/*
* Centered footer component with links to github, contact, and about
*/
export const Footer = memo(() => {
    return (
        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
            <div className="flex-row flex">
                <a href="https://github.com/ethanmchls/cs428-quoridor" className={'footer-link'}>
                    <img src={githubLogo} className="size-4" alt=""/>
                </a>
                <p className={'footer-link'}>|</p>
                <a href="mailto:samolausson@gmail.com" className={'footer-link'}>contact</a>
                <p className={'footer-link'}>|</p>
                <a href="/about" className={'footer-link'}>about</a>
            </div>
        </footer>
    );
});