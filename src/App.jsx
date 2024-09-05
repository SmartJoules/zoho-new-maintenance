import React, { useEffect, useState, Suspense } from 'react';
import Dashboardcard from './Dashboardcard';
import Activitycard from './Activitycard';
import Taskcard from './Taskcard';
import "flatpickr/dist/themes/material_blue.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [listType, setListType] = useState(false);
  const [allPendingRecords, setAllPendingRecords] = useState([]);
  const [allCompletedRecords, setAllCompletedRecords] = useState([]);
  const [pendingRecCount, setPendingRecCount] = useState(0);
  const [completedRecCount, setCompletedRecCount] = useState(0);
  const [areaText, setAreaText] = useState("");
  const [activityID, setActivityID] = useState(null);
  const [pendingTask, setPendingTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const areaFilter = (event) => {
    setAreaText(event.target.value);
  }

  const createTaskList = (id) => {
    setActivityID(id);
  }

  useEffect(() => {
    const fetchRecords = async () => {
      const config = {
        appName: "smart-joules-app",
        reportName: "All_Maintenance_Scheduler_Task_List_Records",
        criteria: `Maintenance_ID == ${activityID}`
      }
      try {
        await ZOHO.CREATOR.init();
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        const data = response.data;
        const pending_records = data.filter(record => record.Status === "Pending");
        const completed_records = data.filter(record => record.Status === "Completed");
        setPendingTask(pending_records);
        setCompletedTask(completed_records);
      } catch (err) {
        console.log(err);
      }
    }

    activityID ? fetchRecords() : null;
  }, [activityID]);

  useEffect(() => {
    const reCount = async () => {
      const countRecords = async (status) => {
        if (listType === true) {
          const config = {
            appName: "smart-joules-app",
            reportName: "All_Maintenance_Scheduler_Task_List_Records",
            criteria: `Maintenance_ID == ${activityID} && Status == "${status}"`
          }
          try {
            await ZOHO.CREATOR.init();
            const resp = await ZOHO.CREATOR.API.getRecordCount(config);
            return resp.result.records_count;
          }
          catch (err) {
            console.log('API Call Failed', err);
          }
        }
        else {
          const config = {
            appName: "smart-joules-app",
            reportName: "Maintenance_Scheduler_Report",
            criteria: `Status == "${status}" && Start_Date >= '01-Sep-2024' && Start_Date <= '30-Sep-2024'`
          }
          const resp = await ZOHO.CREATOR.API.getRecordCount(config);
          return resp.result.records_count;
        }
      }

      await ZOHO.CREATOR.init();
      try {
        const pending_record_count = await countRecords("Pending");
        setPendingRecCount(isNaN(pending_record_count) ? 0 : parseInt(pending_record_count));
      }
      catch (err) {
        console.log(err);
      }
      try {
        const comp_rec_count = await countRecords("Completed");
        setCompletedRecCount(isNaN(comp_rec_count) ? 0 : parseInt(comp_rec_count));
      } catch (error) {
        console.log(error);
      }


    }
    reCount();
  }, [listType]);

  const updateTab = (status) => {
    setActiveTab(status);
  };

  const setListDisplayType = (option) => {
    setListType(option);
  };

  const backToActivity = () => {
    setListType(false);
  };

  useEffect(() => {
    const getRecords = async () => {
      const config = {
        appName: "smart-joules-app",
        reportName: "Maintenance_Scheduler_Report",
        criteria: `Status == "Pending" && Start_Date >= "01-Sep-2024" && Start_Date <= "30-Sep-2024"`
      }
      try {
        await ZOHO.CREATOR.init();
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        setAllPendingRecords(response.data);
      } catch (err) {
        console.log('API CALL FAILED', err);
      }
    }

    ZOHO.CREATOR.init().then(() => {
      getRecords();
    });
  }, []);

  useEffect(() => {
    const getRecords = async () => {
      const config = {
        appName: "smart-joules-app",
        reportName: "Maintenance_Scheduler_Report",
        criteria: `Status == "Completed" && Start_Date >= "01-Sep-2024" && Start_Date <= "30-Sep-2024"`
      }
      try {
        await ZOHO.CREATOR.init();
        const response = await ZOHO.CREATOR.API.getAllRecords(config);
        setAllCompletedRecords(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    ZOHO.CREATOR.init().then(() => {
      getRecords();
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="bg-danger p-2">
          <div className="row">
            <div className="col-6">
              <Dashboardcard type="Pending" count={isNaN(pendingRecCount) ? 0 : parseInt(pendingRecCount)} icon="bi-file-earmark-fill" />
            </div>
            <div className="col-6">
              <Dashboardcard type="Completed" count={isNaN(completedRecCount) ? 0 : parseInt(completedRecCount)} icon="bi-file-earmark-check-fill" />
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
              <div className="d-flex gap-2">
                <input type="text" className='form-control' onChange={areaFilter} placeholder='Search Area' />
                <input type="date" className='form-control custom-date-input' value={startDate} onChange={e => setStartDate(e.target.value)} />
                <input type="date" className='form-control custom-date-input' value={endDate} onChange={e => setEndDate(e.target.value)} />
                
              </div>

            </div>
            <div className="activity-list bg-secondary-subtle overflow-x-hidden w-100 overscroll-auto" style={{ height: '512px' }}>
              {
                activeTab === "Pending" ?
                  (
                    <div className={`card-list overflow-x-hidden ${activeTab === "Pending" ? 'd-block' : 'd-none'}`}>
                      <Suspense fallback={<div>Loading...</div>}>
                        {allPendingRecords.length > 0 ? (
                          allPendingRecords.filter(record => {
                            return (
                              record.Site_Name.display_value.toLowerCase().includes(areaText.toLowerCase()) ||
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
                              actID={record.ID}
                              date={record.Start_Date}
                              fetchID={createTaskList} />
                          ))
                        ) : (
                          <div className='text-center'>No Records Found</div>
                        )}
                      </Suspense>
                    </div>
                  ) : (
                    <div className={`card-list overflow-y-auto overflow-x-hidden ${activeTab === "Completed" ? 'd-block' : 'd-none'}`}>
                      <Suspense fallback={<div>Loading...</div>}>
                        {allCompletedRecords.length > 0 ? (
                          allCompletedRecords.filter(record => {
                            return (
                              record.Site_Name.display_value.toLowerCase().includes(areaText.toLowerCase()) ||
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
                              actID={record.ID}
                              date={record.Start_Date}
                              fetchID={createTaskList} />
                          ))
                        ) : (
                          <div className='text-center'>No Records Found</div>
                        )}
                      </Suspense>
                    </div>
                  )
              }


            </div>
          </>
        ) : (
          <div className="task-list bg-secondary-subtle overflow-x-hidden overflow-y-auto" style={{ height: '512px' }}>
            <div className="my-2">
              <div className="d-flex">
                <input type="text" onChange={areaFilter} className='form-control' placeholder='Search Task Name' />
              </div>
            </div>
            {activeTab === "Pending" ? (
              <div className={`card-list overflow-hidden h-100`}>
                <div className='text-end p-2'><button className='btn btn-danger btn-sm shadow-sm' onClick={backToActivity}>Back</button></div>
                <div className='overflow-y-auto overflow-x-hidden' >
                  {pendingTask
                    .filter(record => record.Task_Name.toLowerCase().includes(areaText.toLowerCase()))
                    .map((record, i) => (
                      <Taskcard
                        key={i}
                        task_name={record.Task_Name}
                        master_id={record.Maintenance_Master}
                        response_type={record.Field_Type.display_value}
                      />
                    ))}
                </div>
              </div>
            ) : (
              <div className={`card-list overflow-hidden`}>
                <div className='text-end p-2'><button className='btn btn-danger btn-sm shadow-sm' onClick={backToActivity}>Back</button></div>
                <div className='overflow-y-auto overflow-x-hidden'>
                  {completedTask
                    .filter(record => record.Task_Name.toLowerCase().includes(areaText.toLowerCase()))
                    .map((record, i) => (
                      <Taskcard
                        key={i}
                        task_name={record.Task_Name}
                        master_id={record.Maintenance_Master}
                        response_type={record.Field_Type.display_value}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
