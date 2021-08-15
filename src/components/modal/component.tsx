import { useMemo, useRef, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { DataContext } from "../../utility/context";
import image1 from "../../images/marker-icon-2x.png";
import image2 from "../../images/marker-icon.png";
import image3 from "../../images/marker-shadow.png";
import style from "./style.module.css";

const Markers = new L.Icon({
  // eslint-disable-next-line global-require
  iconRetinaUrl: image1,
  // eslint-disable-next-line global-require
  iconUrl: image2,
  // eslint-disable-next-line global-require
  shadowUrl: image3,
});
const Modal = ({ open, closeModal, selectedData }: any): JSX.Element => {
  const center = useMemo(() => {
    return {
      lat: selectedData?.location?.[0] || 51.505,
      lng: selectedData?.location?.[1] || -0.09,
    };
  }, [selectedData]);
  const [position, setPosition] = useState(center);
  useEffect(() => {
    setPosition(center);
  }, [selectedData, center]);
  const markerRef = useRef(null);
  const dataHandler = useContext(DataContext);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const { isLoading, error, data } = useQuery(
    "getLocationTypes",
    () => axios.get("/locationTypes"),
    {
      enabled: open,
    }
  );

  const saveForm = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const location = [position?.lat, position?.lng];
    const locationType = event.target.localtionType.value;
    const logo =
      "https://e7.pngegg.com/pngimages/757/1018/png-clipart-apple-logo-apple-desktop-models-logo-computer-wallpaper.png";
    const newValue = {
      id: selectedData?.id || Math.floor(Math.random() * 100),
      name,
      location,
      locationType,
      logo,
    };
    dataHandler.addData(newValue, selectedData?.id);
    closeModal();
  };

  if (isLoading) return <div>...loading</div>;
  if (error) return <div>something is wrong</div>;
  if (open) {
    return (
      <div className={style.modal_wrapper}>
        <div className={style.modal_content}>
          <div className={style.modal_header}>
            <h2>Share Location</h2>
            <button type="button" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className={style.modal_body}>
            <form onSubmit={saveForm}>
              <div className={style.row}>
                <div className={style.col3}>
                  <label htmlFor="name">Location Name: </label>
                </div>
                <div className={style.col9}>
                  <input
                    type="text"
                    id="name"
                    name="locationName"
                    defaultValue={selectedData?.name}
                  />
                </div>
              </div>

              <div className={style.row}>
                <div className={style.col3}>
                  <label htmlFor="nothing">Location on map:</label>
                </div>
                <div className={style.col9}>
                  <div className={style.map}>
                    <MapContainer
                      style={{ height: "300px", width: "300px" }}
                      center={center}
                      zoom={20}
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        draggable
                        position={position}
                        icon={Markers}
                        eventHandlers={eventHandlers}
                        ref={markerRef}
                      />
                    </MapContainer>
                  </div>
                </div>
              </div>
              <div className={style.row}>
                <div className={style.col3}>
                  <label htmlFor="locationType">Location Type:</label>
                </div>
                <div className={style.col9}>
                  <select name="localtionType" id="localtionType">
                    {data?.data.map((item) => (
                      <option
                        key={item.key}
                        value={item.value}
                        selected={selectedData?.locationType === item.value}
                      >
                        {item.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={style.row}>
                <div className={style.col3}>
                  <label htmlFor="logo">Logo:</label>
                </div>
                <div className={style.col9}>
                  <input
                    accept="image/*"
                    className={style.file}
                    id="logo"
                    type="file"
                    name="logo"
                  />
                </div>
              </div>
              <footer className={[style.row, style.btns].join(" ")}>
                <button type="submit">save</button>
                <button type="button" onClick={closeModal}>
                  cancel
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <div />;
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  selectedData: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
    .isRequired,
};

export default Modal;
