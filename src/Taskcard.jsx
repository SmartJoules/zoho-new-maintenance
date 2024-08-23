import React from 'react' 

const Taskcard = (task_name) => {
  return (
    <>
    <div className="row">
        <div className="col-12">
            <div className="card my-2">
                <div className="card-header"><div className="fw-bold">{task_name}</div></div>
                <div className="card-body">

                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Taskcard
