import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import matchSorter from 'match-sorter';
import Chance from 'chance';
import checkboxHOC from 'react-table/lib/hoc/selectTable';

const CheckboxTable = checkboxHOC(ReactTable);
const chance = new Chance();

function getData() {
  const data = require('./data').map(item => {
    const _id = chance.guid();
    return {
      _id,
      ...item
    };
  });
  return data;
}

function getColumns() {
  const columns = [{
    Header: 'Course',
    accessor: 'Course',
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["Course"] }),
    filterAll: true,
    minWidth: 200
  }, {
    Header: 'Code',
    id: 'Code',
    accessor: d => d.Code,
    filterMethod: (filter, rows) =>
      matchSorter(rows, filter.value, { keys: ["Code"] }),
    filterAll: true,
    maxWidth: 250,
  }, {
    Header: 'Campus',
    accessor: 'Campus',
    maxWidth: 150,
    filterMethod: (filter, row) => {
      if (filter.value === "all") {
        return true;
      }
      if (filter.value === "pasila") {
        return row[filter.id] === "PASILA";
      }
      if (filter.value === "haaga") {
        return row[filter.id] === "HAAGA";
      }
      if (filter.value === "malmi") {
        return row[filter.id] === "MALMI";
      }
      if (filter.value === "porvoo") {
        return row[filter.id] === "PORVOO";
      }

    },
    Filter: ({ filter, onChange }) =>
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: "100%" }}
        value={filter ? filter.value : "all"}
      >
        <option value="all">All</option>
        <option value="pasila">Pasila</option>
        <option value="haaga">Haaga</option>
        <option value="malmi">Malmi</option>
        <option value="porvoo">Porvoo</option>
      </select>
  }, {
    Header: 'Language',
    accessor: 'Language',
    maxWidth: 150,
    filterMethod: (filter, row) => {
      if (filter.value === "all") {
        return true;
      }
      if (filter.value === "eng") {
        return row[filter.id] === "ENG";
      }
      if (filter.value === "fin") {
        return row[filter.id] === "FIN";
      }
    },
    Filter: ({ filter, onChange }) =>
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: "100%" }}
        value={filter ? filter.value : "all"}
      >
        <option value="all">All</option>
        <option value="eng">English</option>
        <option value="fin">Finnish</option>

      </select>
  }, {
    Header: 'Program',
    accessor: 'Program',
    maxWidth: 250
  }, {
    Header: 'Virtual/Distance Learning',
    accessor: 'Studymethod',
    maxWidth: 250,
    Cell: row => (
      <span> {
        row.value === '' ? 'No'
        : row.value === 'VIR' ? 'Virtual'
        : row.value === 'VIROS' ? 'Virtual'
        : row.value
      }
      </span>
    )
  }, {
    Header: 'Credits',
    accessor: 'Credits',
    maxWidth: 100
  }
  ];
  return columns;
}

class App extends Component {
  constructor() {
    super();
    const data = getData();
    const columns = getColumns();
    this.state = {
      data,
      columns,
      selection: []
    };
    }


  toggleSelection = (key, shift, row) => {
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    if (keyIndex >= 0) {
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      selection.push(key);
    }
    this.setState({ selection });
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  logSelection = () => {
    var coursesname = '';
    if (this.state.selection.length === 0) {
      coursesname = 'No selection.';
    } 
    else {
      var selectedArray = this.state.selection;
      for (var i in selectedArray) {
        var result = this.state.data.filter(obj => {
          return obj._id === selectedArray[i]
        });
        coursesname += '<li>' + result[0].Course + ' (' + result[0].Code + ').</li>';
      }
    }
    return {__html: '<ul>' + coursesname + '</ul>'};
  };
 
  render() {
    const { toggleSelection, isSelected, logSelection } = this;
    const { data, columns } = this.state;

    const checkboxProps = {
      isSelected,
      toggleSelection,
      selectType: "checkbox"
    };

    return (
      
      <div className="App">
        <header className="App-header">
        <div className="row">
          <div className="col text-right">
            <h1 className="App-title">Haaga-Helia Courses</h1>          
          </div>
          <div className="col text-left">
            <button type="button" className="btn btn-primary mr-2" data-toggle="modal" data-target="#courseModal">
              Add Selected
            </button>
            <button type="button" className="btn btn-success">
              Create Timetable
            </button>     
          </div>
        </div>
        </header>
        <div id="main">
          <CheckboxTable
            ref={r => (this.checkboxTable = r)}
            data={data}
            columns={columns}
            className="-striped -highlight"
            {...checkboxProps}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value}
            SubComponent={row => {
              return (
                <div className="card">
                  <h5 className="card-header">{this.state.data[row.index].Course}<br />
                  <em>({this.state.data[row.index].Begins} to {this.state.data[row.index].Ends})</em></h5>
                  <div className="card-body">
                    <h5 className="card-title">{this.state.data[row.index].Field}</h5>
                    <p className="card-text">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">Teacher: <strong>{this.state.data[row.index].Teacher}</strong></li>
                        <li className="list-group-item">First Period: <strong>{this.state.data[row.index].FirstPeriod}</strong></li>
                        <li className="list-group-item">Second Period: <strong>{this.state.data[row.index].SecondPeriod}</strong></li>
                        <li className="list-group-item">Rooms: <strong>{this.state.data[row.index].Rooms}</strong></li>
                      </ul>
                    </p>
                    <a href={this.state.data[row.index].URL} className="btn btn-primary" target="_blank">Course Description</a>
                  </div>
                </div>
              )
            }}
          />
        </div>
      
        <div className="modal fade" id="courseModal" tabIndex="-1" role="dialog" aria-labelledby="courseModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="courseModalLabel">Selected Courses</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div id="modalCourseContents" className="modal-body" dangerouslySetInnerHTML={logSelection()}>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
