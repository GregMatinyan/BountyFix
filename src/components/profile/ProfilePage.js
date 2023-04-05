import React, { useEffect, useState } from "react";
import Header from "../headerComponents/Header";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  usersCollection,
  storage,
  offersCollection,
} from "../../configs/firebase";
import styles from "./ProfilePage.module.css";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import ModeIcon from "@mui/icons-material/Mode";
import EditProfile from "./EditProfile";
import FavDialog from "./FavoritesDialog";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [favs, setFavs] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [favDialog, setFavDialog] = useState(false);

  const params = useParams();

  useEffect(() => {
    const render = async () => {
      const dataRef = doc(usersCollection, params.userId);
      const data = await getDoc(dataRef);
      setUserData({ ...data.data() });
    };
    render();
  }, [params.userId]);

  useEffect(() => {
    if (!userData) return;
    Object.keys(userData.favorites).map(async (id) => {
      const offerPureData = await getDoc(doc(offersCollection, id));
      const offerData = { ...offerPureData.data(), id };
      setFavs((prev) => [...prev, offerData]);
    });
    userData.userHosts.map(async (id) => {
      const userHostsData = await getDoc(doc(offersCollection, id));
      setHosts((prev) => [...prev, { ...userHostsData.data(), id }]);
    });
  }, [userData]);
  console.log(hosts);

  async function updateProfileData(name, surname, avatar) {
    const storageRef = ref(storage, `avatars/${userData.email}`);
    await uploadBytes(storageRef, avatar);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(usersCollection, params.userId), {
      name,
      surname,
      url,
    });
  }

  const openDialog = () => {
    setDialog(true);
  };
  const closeDialog = () => {
    setDialog(false);
  };

  function addedHosts() {
    return hosts.map((item) => {
      return (
        <div key={item.id} className={styles.favContainer}>
          <div className={styles.addedHostContainer}>
            <div className={styles.addedHostInfo}>
              <div>
                <Link to={`/item/${item.id}`}>
                  <img
                    style={{ width: "100%" }}
                    src={item.urls[0]}
                    alt="host img"
                  />
                </Link>
              </div>
              <div style={{ padding: "5px 10px" }}>
                <p> {item.hostName}</p>
                <p> {item.location}</p>
                <p>
                  <strong>{item.price} $</strong> per/night
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div style={{ padding: "8px 15px" }}>
      {userData && (
        <>
          <FavDialog
            favorites={favs}
            open={favDialog}
            handleClose={() => setFavDialog(false)}
          />
          <Header />
          <div className={styles.profileContainer}>
            <div className={styles.avatar}>
              <img src={userData.url} alt="avatar" />
              <div className={styles.sideButtons}>
                <span onClick={openDialog} style={{ cursor: "pointer" }}>
                  Edit profile: <ModeIcon />
                </span>
                <button onClick={() => setFavDialog(true)}>Favorites</button>
                <button>Your hosts</button>
              </div>
            </div>
            <div className={styles.profileDataContainer}>
              <h3>
                {userData.name} {userData.surname}
              </h3>
              <h4>Email: {userData.email}</h4>
            </div>

            {/* <div className={styles.favsContainer}>
              <h4>Hosts you've liked</h4>
              <ul>
                {favs.map((item) => {
                  return (
                    <>
                      <li key={item.id}>
                        <Link
                          to={`/item/${item.id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <div className={styles.favsInnerContainer}>
                            <div className={styles.favsImgContainer}>
                              <img src={item.urls[0]} alt="host img" />
                            </div>
                            <div>
                              <p>{item.hostName}</p>
                              <p>{item.location}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
            <div className={styles.favsContainer}>
              <h4>Hosts you've added</h4>
              <ul>
                {hosts.map((item) => {
                  return (
                    <>
                      <li key={item}>
                        <Link
                          to={`/item/${item}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <div className={styles.favsInnerContainer}>
                            <div className={styles.favsImgContainer}>
                              <img src={item.urls[0]} alt="host img" />
                            </div>
                            <div>
                              <p>{item.hostName}</p>
                              <p>{item.location}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div> */}
            {/* <span>Here is your added hosts</span> */}
          </div>
          {addedHosts()}

          <EditProfile
            open={dialog}
            handleClose={closeDialog}
            updateData={updateProfileData}
            userData={userData}
          />
        </>
      )}
    </div>
  );
}

export default ProfilePage;
