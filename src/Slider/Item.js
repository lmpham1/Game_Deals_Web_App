import React from 'react';
import {Link} from 'react-router-dom';
import cx from 'classnames';
import SliderContext from './context'
import ShowDetailsButton from './ShowDetailsButton'
import Mark from './Mark'
import './Item.scss'

const Item = ({ game }) => (
  <SliderContext.Consumer>
    {({ onSelectSlide, currentSlide, elementRef }) => {
      const isActive = currentSlide && currentSlide.id === game.gameID;
      return (
        <div
          ref={elementRef}
          className={cx('item', {
            'item--open': isActive,
          })}
        >
            <div className="img-wrapper"  style={{height: 200, position: 'relative'}}>
              <img src={game.thumb} alt="" className="img-responsive"/>
              <div className="img-overlay">
              <p style={{fontFamily: 'Bebas Neue', cursive: true, color: 'white', backgroundColor: 'rgba(10, 10, 10, 0.6)', wordWrap: 'break-word', display: 'inline', paddingLeft: 5, paddingRight: 5}}>{game.title}</p>
              <br/>
              <p className="badge badge-danger" style={{marginTop: 5}}>{game.salePrice}$ (-{Math.floor(game.savings)}%)</p>
              </div>
            </div>
          <ShowDetailsButton onClick={() => onSelectSlide(game)} />
          {isActive && <Mark />}
        </div>
      );
    }}
  </SliderContext.Consumer>
);

export default Item;
