function Table(props) {
  const color = props.available ? '#faf0cfcc' : '#e59292cc';
  const style = {
    position: 'absolute',
    left: `${props.x}px`,
    top: `${props.y}px`,
    backgroundColor: color,
    color: 'black'
  }
  return (
    <div className="restTable" style={style} onClick={() => props.tableAction(props.available, props.number)}>
      <p>{props.number}</p>
    </div>
  );
}

export default Table;