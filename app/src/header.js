import React, { memo } from 'react';
// import pawnLogo from './pawn.png';

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
        <div className="navbar bg-base-300 rounded-sm">
            <div className="w-full justify-between">
                <div className="w-32 text-2xl mx-4 font-bold">Quoridor</div>
                <div className="text-md breadcrumbs">
                    <ul>
                        { currentPath === PATH.ABOUT && (
                            <>
                                <li><a href="/" className="hover:text-primary">Home</a></li>
                                <li>About</li>
                            </>
                        )}
                        { currentPath === PATH.CONTACT && (
                            <>
                                <li><a href="/" className="hover:text-primary">Home</a></li>
                                <li>Contact</li>
                            </>
                        )}
                        { currentPath === PATH.GAME && (
                            <>
                                <li><a href="/" className="hover:text-primary">Home</a></li>
                                <li>Game</li>
                            </>
                        )}
                        {/* { currentPath === PATH.HOME && (
                            <li>Home</li>
                        )} */}
                    </ul>
                </div>
                <div className="w-32 mx-4"></div>
            </div>
        </div>
        // <div className={'header'}>
        //     <div className={'header-content'}>
        //         <img src={pawnLogo} className={'logo'} alt=""/>
        //         <a href="/" className={'header-link'}>
        //             Home
        //         </a>
        //         { currentPath === PATH.ABOUT && (
        //             <>
        //                 <p className={'header-link'}>/</p>
        //                 <a href="/about" className={'header-link'}>About</a>
        //             </>
        //         )}
        //         { currentPath === PATH.CONTACT && (
        //             <>
        //                 <p className={'header-link'}>/</p>
        //                 <a href="/contact" className={'header-link'}>Contact</a>
        //             </>
        //         )}
        //         { currentPath === PATH.GAME && (
        //             <>
        //                 <p className={'header-link'}>/</p>
        //                 <div className={'header-link'}>Game</div>
        //             </>
        //         )}
        //     </div>
        // </div>
    );
});