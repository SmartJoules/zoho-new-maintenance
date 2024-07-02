import React, { useEffect, useState, Suspense } from 'react';
import Dashboardcard from './Dashboardcard';
import Activitycard from './Activitycard';
import Taskcard from './Taskcard';

const App = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [listType, setListType] = useState(false);
  const [allPendingRecords, setAllPendingRecords] = useState([]);
  const [allCompletedRecords, setAllCompletedRecords] = useState([]);
  const [pendingRecCount, setPendingRecCount] = useState(0);
  const [completedRecCount,setCompletedRecCount] = useState(0);
  const [areaText,setAreaText] = useState("");

  const areaFilter = (event)=>{
    setAreaText(event.target.value);
  }
  
  useEffect(()=>{
    const count = ()=> {
      setPendingRecCount( allPendingRecords ? allPendingRecords.length : 0);
    }
    count();
  },[allPendingRecords]);
  useEffect(()=>{
    const count = ()=> {
      setCompletedRecCount( allCompletedRecords ? allCompletedRecords.length : 0);
    }
    count();
  },[allCompletedRecords]);

  const updateTab = (status) => {
    setActiveTab(status);
  };

  const setListDisplayType = (option) => {
    setListType(option);
  };

  const backToActivity = () => {
    setListType(false);
  };

  // For getting pending records
  useEffect(() => {
    const getRecords = async () => {
      const config = {
        appName: "smart-joules-app",
        reportName: "Maintenance_Scheduler_Report",
        criteria: `Status == "Pending" && Start_Date >= "01-Jul-2024" && Start_Date <= "31-Jul-2024"`
      }
      try {
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        // console.log("API Success", response.data);
        setAllPendingRecords(response.data);
      }
      catch (err) {
        console.log(err);
      }

    }
    ZOHO.CREATOR.init()
      .then(function (data) {
        getRecords();
      });
  }, [])

  // For getting completed records

  useEffect(() => {
    const getRecords = async () => {
      const config = {
        appName: "smart-joules-app",
        reportName: "Maintenance_Scheduler_Report",
        criteria: `Status == "Completed" && Start_Date >= "01-Jul-2024" && Start_Date <= "31-Jul-2024"`
      }
      try {
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        // console.log("API Success", response.data);
        setAllCompletedRecords(response.data);
      }
      catch (err) {
        console.log(err);
      }

    }
    ZOHO.CREATOR.init()
      .then(function (data) {
        getRecords();
      });
  }, [allPendingRecords])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="bg-danger p-3">
          <div className="row">
            <div className="col-6">
              <Dashboardcard type="Pending" count={pendingRecCount} icon="bi-file-earmark-fill" />
            </div>
            <div className="col-6">
              <Dashboardcard type="Completed" count={completedRecCount} icon="bi-file-earmark-check-fill" />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <nav className="nav">
          <a className={`nav-link ${activeTab === "Pending" ? "active" : ""}`} onClick={() => updateTab("Pending")}>Pending</a>
          <a className={`nav-link ${activeTab === "Completed" ? "active" : ""}`} onClick={() => updateTab("Completed")}>Completed</a>
        </nav>
      </div>
      <div className="row">
        {listType === false ? (
          <>
            <div className="p-2 bg-secondary-subtle">
              <input type="text" className='form-control' onChange={areaFilter} placeholder='Search Area' />
            </div>
            <div className="activity-list bg-secondary-subtle overflow-x-hidden w-100" style={{ height: '47.5em' }}>
              <div className={`card-list overflow-x-hidden ${activeTab === "Pending" ? 'd-block' : 'd-none'}`}>
                <Suspense fallback={<div>Loading...</div>}>
                  {allPendingRecords && allPendingRecords && allPendingRecords.length > 0 ? (
                    allPendingRecords.filter(record => {
                      return (
                        record.Site_Name.display_value.toLowerCase().includes(areaText.toLowerCase) ||
                        record.Title.toLowerCase().includes(areaText.toLowerCase()) ||
                        record.Area.toLowerCase().includes(areaText.toLowerCase())
                      )
                    }).map((record, index) => (
                      <Activitycard
                        key={index}
                        onIncrement={setListDisplayType}
                        cardType="activity"
                        site_name={record.Site_Name.display_value}
                        area={record.Area}
                        title={record.Title}
                        progress={record.Progress}
                        date={record.Start_Date} />
                    ))
                  ) : (
                    <div className='text-center'>No Records Found</div>
                  )}
                </Suspense>
              </div>
              <div className={`card-list overflow-x-hidden ${activeTab === "Completed" ? 'd-block' : 'd-none'}`}>
                <Suspense fallback={<div>Loading...</div>}>
                {allCompletedRecords && allCompletedRecords.length > 0 ? (
                  allCompletedRecords.filter(record => {
                    return (
                      record.Site_Name.display_value.toLowerCase().includes(areaText.toLowerCase) ||
                      record.Title.toLowerCase().includes(areaText.toLowerCase()) ||
                      record.Area.toLowerCase().includes(areaText.toLowerCase())
                    )
                  }).map((record, index) => (
                    <Activitycard
                      key={index}
                      onIncrement={setListDisplayType}
                      cardType="activity"
                      site_name={record.Site_Name.Site_Name}
                      area={record.Area}
                      title={record.Title}
                      progress={record.Progress}
                      date={record.Start_Date} />
                  ))
                ) : (
                  <div className='text-center'>No Records Found</div>
                )}
                </Suspense>
              </div>
            </div>
          </>
        ) : (
          <div className="task-list bg-secondary-subtle overflow-x-hidden">
            <div className="my-2">
              <div className="d-flex">
                <input type="text" className='form-control' placeholder='Search Task Name' />
              </div>
            </div>
            <div className={`card-list overflow-x-hidden ${activeTab === "Pending" ? 'd-block' : 'd-none'}`}>
              <div className='text-end p-2'><button className='btn btn-danger btn-sm shadow-sm' onClick={backToActivity}>Back</button></div>
              <Taskcard />
            </div>
            <div className={`card-list overflow-x-hidden ${activeTab === "Completed" ? 'd-block' : 'd-none'}`}>
              <div className='text-end p-2'><button className='btn btn-danger btn-sm shadow-sm' onClick={backToActivity}>Back</button></div>
              <Taskcard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
