import { useEffect } from 'react';

const Requests = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, [setSelectedLink, link]); // Include dependencies here

  return <div>Requests</div>;
};

export default Requests;
