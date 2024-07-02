import React from 'react'
const Activitycard = ({onIncrement, site_name, area, title, progress, date}) => {

  const handleClick = () => {
    onIncrement(true);
  }
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card my-2">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold fs-5">{area}</div>
                  <div className="fs-6">{date}</div>
                </div>
                <div>
                  <i className="bi bi-caret-right-square-fill fs-1 text-danger"></i>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="p-2">
                <div className="d-flex">
                  <div className="w-50">
                    <div className="fw-600">Site Name</div>
                    <div className="fw-600">Title</div>
                    <div className="fw-600">Progress</div>
                  </div>
                  <div className="w-50">
                    <div className="fw-600">{site_name}</div>
                    <div className="fw-600">{title}</div>
                    <div className="fw-600">{progress}</div>
                  </div>
                </div>
                <div className="d-flex mt-2 justify-content-end">
                  <button className="btn border border-primary text-primary fw-bold" onClick={handleClick}><i className="bi bi-file-earmark-text"></i><span className="mx-2">Checklist </span><i className="bi bi-arrow-right"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Activitycard
