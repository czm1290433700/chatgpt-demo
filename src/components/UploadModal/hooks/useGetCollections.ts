import axios from "axios";
import { useEffect, useState } from "react";

const useGetCollections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/get_collection_names").then((data) => {
      setCollections(data.data.collection_names);
    });
  }, []);

  return collections;
};

export default useGetCollections;
