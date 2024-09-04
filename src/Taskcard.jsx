import React from 'react' 
import Response from './Response'

const Taskcard = props => {
  return (
    <>
    <div className="row">
        <div className="col-12">
            <div className="card my-2">
                <div className="card-header"><div className="fw-bold">{props.task_name}</div></div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-8">
                      <Response 
                      task={props.task_name}
                      master_id={props.master_id}
                      field_type={props.response_type}/>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Taskcard
