import { useContext } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import PropTypes from "prop-types";
import { DataContext } from "../../utility/context";
import { AddButton, Modal } from "..";
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

function MainMap(props): JSX.Element {
  const { modalStatus, openDialog, closeModal, selectedData } = props;
  const data = useContext(DataContext);
  return (
    <div className={style.App}>
      <MapContainer
        style={{ height: "100vh" }}
        center={[51.505, -0.09]}
        zoom={10}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.locations.map((item, index) => (
          <Marker key={item.id} position={item.location} icon={Markers}>
            <Popup className={style.map_popup}>
              <div>{item.name}</div>
              <div>
                <img src={item.logo} alt="logo" className={style.img_logo} />
              </div>
              <div>
                <button type="button" onClick={() => data.editData(index)}>
                  Edit
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <AddButton popupHandler={() => openDialog("new")} />
      </MapContainer>
      <Modal
        open={modalStatus}
        closeModal={closeModal}
        selectedData={selectedData}
      />
    </div>
  );
}

MainMap.propTypes = {
  closeModal: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  modalStatus: PropTypes.bool.isRequired,
  selectedData: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
    .isRequired,
};

export default MainMap;
