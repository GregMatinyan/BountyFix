import React from "react";
import { Link } from "react-router-dom";
import styles from "./RenderHost.module.css";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useSelector } from "react-redux";

function RenderHost(props) {
  const { id, urls, hostName, price, location } = props.data;
  const user = useSelector(function (state) {
    return state.currentUser.logedIn;
  });
  const Slideshow = () => {
    return (
      <div className="slide-container">
        <Fade>
          {urls.map((fadeImage, index) => (
            <div key={index}>
              <img style={{ width: "100%" }} src={fadeImage} alt="host img" />
            </div>
          ))}
        </Fade>
      </div>
    );
  };

  const handleLike = () => {
    if (!user) {
      alert("Log in");
    } else {
    }
  };
  return (
    <>
      <Link className={styles.hosts} to={`item/${id}`}>
        <div className={styles.hostContainer} key={id}>
          <div className={styles.imgContainer}>
            <div onClick={handleLike} href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={styles.faheart}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            {Slideshow()}
          </div>
          <div className={styles.hostInfo}>
            <p> {hostName}</p>
            <p> {location}</p>
            <p>
              <strong>{price} $</strong> per/night
            </p>
          </div>
        </div>
      </Link>
    </>
  );
}

export default RenderHost;
