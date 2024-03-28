import { Footer } from "./footer.js";
import { Header, PATH } from './header.js';

export const About = () => {
    return (
      <div className="flex flex-col h-screen">
        <Header currentPath={PATH.ABOUT} />
        <div className="flex-grow">
          <div className="flex-row w-3/4 mx-auto my-8 h-full">
            <h1 className="text-3xl font-bold">About</h1>
            <p>
              This website was created as a part of a school project for CS 428 at Brigham Young University.<br />
              The developers were Ethan Michaelis, Samuel Olausson, Garret Sapp, and Michael Perkins.<br />
              The backend was built with Node.js and the frontend was built with React.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  };