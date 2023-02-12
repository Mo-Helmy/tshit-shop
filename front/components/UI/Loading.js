import React from 'react';

import classes from './Loading.module.css';

const Loading = () => {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      role="progressbar"
      className={classes.container}
    >
      <div className={classes.swing}>
        <div className={classes['swing-l']}></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div className={classes['swing-r']}></div>
      </div>
      <div className={classes.shadow}>
        <div className={classes['shadow-l']}></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div className={classes['shadow-r']}></div>
      </div>
    </div>
  );
};

export default Loading;
