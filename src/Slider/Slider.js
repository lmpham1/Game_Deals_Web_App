import React, { useState } from 'react';
import cx from 'classnames';
import SliderContext from './context'
import Content from './Content'
import SlideButton from './SlideButton'
import SliderWrapper from './SliderWrapper'
import useSliding from './useSliding'
import useSizeElement from './useSizeElement'
import './Slider.scss'

const Slider = ({ children, activeSlide, user, loggedIn }) => {
  const [currentSlide, setCurrentSlide] = useState(activeSlide);
  const [theUser, setTheUser] = useState(user);
  const { width, elementRef } = useSizeElement();
  const {
    handlePrev,
    handleNext,
    slideProps,
    containerRef,
    hasNext,
    hasPrev
  } = useSliding(width, React.Children.count(children));

  const handleSelect = movie => {
    setCurrentSlide(movie);
  };

  const handleClose = () => {
    setCurrentSlide(null);
  };

  const handleAddToWishlist = gameObj => {
    //console.log("loading")
    fetch(`http://localhost:8080/api/addGame/${theUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameObj)
        })
        .then(data => data.json())
        .then((res) => {
            //console.log(res);
            
            setTheUser(res);
        })
        .catch(err => console.log(err));
  };

  const handleRemoveFromWishlist = (gameObj) => {
    fetch(`http://localhost:8080/api/removeGame/${theUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameObj)
        })
        .then(data => data.json())
        .then(res => {
            setTheUser(res)
            //console.log(res);
        })
        .catch(err => console.log(err));
  }

  const contextValue = {
    onSelectSlide: handleSelect,
    onCloseSlide: handleClose,
    onAdd: handleAddToWishlist,
    onRemove: handleRemoveFromWishlist,
    elementRef,
    currentSlide
  };
  return (
    <SliderContext.Provider value={contextValue}>
      <SliderWrapper>
        <div
          className={cx('slider', { 'slider--open': currentSlide != null })}
        >
          <div ref={containerRef} className="slider__container" {...slideProps}>{children}</div>
        </div>
        {hasPrev && <SlideButton onClick={handlePrev} type="prev" />}
        {hasNext && <SlideButton onClick={handleNext} type="next" />}
      </SliderWrapper>
      {currentSlide && <Content user={theUser} loggedIn={loggedIn} movie={currentSlide} onClose={handleClose} onAddGame={handleAddToWishlist} onRemoveGame={handleRemoveFromWishlist}/>}
    </SliderContext.Provider>
  );
};

export default Slider;
