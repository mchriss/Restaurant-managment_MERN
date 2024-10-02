import { useState } from "react";

const backendAddress = 'http://localhost:8080';

function Gallery(props) {
  const images = props.images;
  const imgCount = images.length;
  const [visibilities, setVisibilities] = useState(() => images.map((image) => false));
  const [active, setActive] = useState(() => images.map((image) => false));
  const reset = Array(imgCount).fill(false);

  function showImage(index) {
    setVisibilities(reset);
    setActive(reset);

    const newVisibilities = reset;
    newVisibilities[index] = true;
    setVisibilities(newVisibilities);

    const newActives = reset
    newActives[index] = true;
    setActive(newActives);
  }

  function changeImage(event) {
    const index = event.currentTarget.dataset.index;
    showImage(index);
  }

  return (
    <div className="gallery">
      <div className="galleryGrid">
        {images.map((image, index) => {
          return (
            <div className="galleryColumn">
              <img alt={image.path} className={active[index] ? 'thumbnailImage cursor active' : 'thumbnailImage cursor'} src={ `${backendAddress}/uploadDir/${image.path}` } data-index={index} onClick={changeImage} ></img>
            </div>
          );
        })}
      </div>
      
        {images.map((image, index) => {
          return (
            <div className={visibilities[index] ? 'galleryImage show' : 'galleryImage hide'}>
              <img className="bigPic" alt={image.path} src={ `${backendAddress}/uploadDir/${image.path}` }></img>
              <div className="imageNumber">{`${index + 1} / ${imgCount}`}</div>
            </div>
          );
        })}
    </div>
  );
}

export default Gallery;