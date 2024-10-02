import Table from "./Table";
import MapImage from '../utils/restaurantMap.png';
import { useEffect, useRef, useState } from "react";

function RestMap(props) {
  const { width, height, tables, date, reservations } = props;
  const [x, setX] = useState();
  const [y, setY] = useState();
  const imageRef = useRef();

  const newResDate = new Date(date);
  const tableAvailability = Array(13).fill(true);
  reservations.forEach(reservation => {
    if (reservation.status === 'APPROVED') {
      const resTable = reservation.tableNr;
      const resDate = new Date(reservation.date);
      const minLimit = new Date(resDate.getTime() - 2 * 60 * 60 * 1000);
      const maxLimit = new Date(resDate.getTime() + 2 * 60 * 60 * 1000);
      if (newResDate.getTime() > minLimit.getTime() && newResDate.getTime() < maxLimit.getTime()) {
        tableAvailability[resTable] = false;
      }
    }
  });

  function getPosition() {
    const x = imageRef.current.offsetLeft;
    setX(x);
    const y = imageRef.current.offsetTop;
    setY(y);
  }

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', getPosition);
  }, []);

  function displayTables(tables) {
    return (
      <div>
        {tables.map((table) => <Table table={table} number={table.number} x={x + table.x} y={y + table.y} available={tableAvailability[table.number]} tableAction={props.tableAction}/>)}
      </div>
    );
  }

  return (
    <div id="restMapContainer" style={{width: `${width}`, height: `${height}`}}>
      <img className="restMap" ref={imageRef} alt="Map" src={MapImage}/>
      {displayTables(tables)}
    </div>
  );
}

export default RestMap;