import { Footer } from "./footer.js";
import { Header, PATH } from './header.js';
import './about.css';
import './App.css';

export const About = () => {
    return (
      <div className="App">
        <Header currentPath={PATH.ABOUT} />
        <div className={'App-content'}>
          <div classname={'about'}>
            <h1>About</h1>
            <p>
                This website was created as a part of a school project for CS 428 at Brigham Young University.
                The developers were Ethan Michaelis, Samuel Olausson, Garret Sapp, and Michael Perkins.
                The backend was built with Node.js and the frontend was built with React.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  };