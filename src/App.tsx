import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
// eslint-disable-next-line import/extensions
import { DataProvider } from "./utility/context.js";
// eslint-disable-next-line import/extensions
import { baseUrl } from "./constants.js";
import { MainMap } from "./components";

axios.defaults.baseURL = baseUrl;

const queryClient = new QueryClient();

interface IselectedData {
  id: number;
  details: string;
  location: number[];
  logo: string;
  name: string;
}

function App(): JSX.Element {
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<IselectedData | boolean>(
    false
  );

  const [data, setData] = useState({
    locations: [
      {
        id: 1,
        details: "lorem1",
        location: [51.505, -0.09],
        logo: "https://e7.pngegg.com/pngimages/757/1018/png-clipart-apple-logo-apple-desktop-models-logo-computer-wallpaper.png",
        name: "test",
      },
      {
        id: 2,
        details: "lorem2",
        location: [50.005, -0.19],
        logo: "https://e7.pngegg.com/pngimages/757/1018/png-clipart-apple-logo-apple-desktop-models-logo-computer-wallpaper.png",
        name: "test2",
      },
    ],
  });
  const editData = useCallback(
    (index) => {
      const currentData = data.locations[index];
      setSelectedData(currentData);
      openDialog(false);
    },
    [data]
  );
  const addData = useCallback(
    (newData, id) => {
      if (id) {
        const locations = [...data.locations];
        const foundIndex = locations.findIndex((x) => x.id === id);
        locations[foundIndex] = newData;
        const newDatas = { ...data, locations };
        setData(newDatas);
      } else {
        const updatedState = {
          ...data,
          locations: [...data.locations, newData],
        };
        setData(updatedState);
      }
    },
    [data, setData]
  );
  const openDialog = (status) => {
    if (status === "new") {
      setSelectedData(false);
      setModalStatus(true);
    } else {
      setModalStatus(true);
    }
  };
  const closeModal = () => {
    setModalStatus(false);
  };

  const getContextValue = useCallback(
    () => ({
      ...data,
      addData,
      editData,
    }),
    [data, addData, editData]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider value={getContextValue()}>
        <MainMap
          closeModal={closeModal}
          openDialog={openDialog}
          modalStatus={modalStatus}
          selectedData={selectedData}
        />
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App;
