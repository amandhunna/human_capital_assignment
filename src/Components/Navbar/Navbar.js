import React, { useContext } from 'react';
import csvContent from "./candidateDetails.csv";
import papa from "papaparse";
import './nav.css';

import { UserContext } from '../../userContext';
import { AuthContext } from '../../authContext';


function Navbar() {
    const { setUserId, setTaskList } = useContext(UserContext);
    const { setAuthed } = useContext(AuthContext);
    
    function handleUploadTaskTickets(e) {
        const file =  e.target.files[0];
        
        function readFileContent(file) {
            const reader = new FileReader()
          return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result)
            reader.onerror = error => reject(error)
            reader.readAsText(file)
          })
        }    
        
        readFileContent(file).then(content => {
            const parsedData = papa.parse(content);
            // console.log("-------", content);
            //console.log("=======", parsedData)
            /* assuming no case will fail */
            setTaskList(parsedData.data);
        }).catch(error => console.log(error))
    }

    function handleLogout() {
        localStorage.setItem('rememberMe', false);
        localStorage.setItem('userId', '');
        setUserId(null);
        setAuthed(false);
    }



    return (
        <div className="bar">
            <h1>Trello-Clone</h1>
            <div className="nav-action">
                <a 
                    className="nav-button" 
                    href={csvContent}
                    download="sample-task-format.csv"
                >Download sample task ticket data</a>
                <div className="button-wrap">
                    <input
                        className="nav-button-input"
                        id="upload-task-csv"
                        accept=".csv"
                        onChange={handleUploadTaskTickets}
                        type="file"
                    />
                    <label className="nav-button-label nav-button" htmlFor="upload-task-csv">Upload task tickets</label>
                </div>
                <button 
                    className="nav-button"
                    onClick={() => {
                        handleLogout();
                    }}
                    >Sign Out
                </button>
            </div>
        </div>
    )
}

export default React.memo(Navbar);
