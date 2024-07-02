import React from "react";
import PropTypes from 'prop-types';

const Dashboardcard = ({ type, count, icon, }) => {
  return (
    <div className="rounded py-3 bg-white">
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-center w-60">
          <h3 className="text-dark">{count}</h3>
          <div className="text-secondary fw-bold">{type}</div>
        </div>
        <div className="text-center w-40">
          <i className={`bi ${icon} fs-1 text-danger`}></i>
        </div>
      </div>
    </div>
  );
}

Dashboardcard.propTypes = {
  type: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
};

export default Dashboardcard;
