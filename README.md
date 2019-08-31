# Haaga-Helia Courses Table

Currently, the only way to find courses to enrol in at Haaga-Helia is through a giant Excel file hosted on the school's page. I wanted to make a more visually appealing and easier way to nagivate through the courses, so I converted the Excel into JSON and made a simple app with React JS.

I've deployed this app using Microsoft's Azure services. You can preview it [here](https://hhcourses.azurewebsites.net/).

## More Info

You can sort and filter through all the courses offered at the 3 largest Haaga-Helia campuses. I'm planning on further creating a way to make your own personal timetable/calendar with the courses you select.

## Built With

* [Create React App](https://github.com/facebookincubator/create-react-app) - The framework used.
* [React Table](https://react-table.js.org/#/story/readme) - A lightweight, fast and extendable datagrid built for React.
* [Chance](https://chancejs.com/) - Creates unique IDs for courses.
* [matchSorter](https://www.npmjs.com/package/match-sorter) - Used to filter and search through course properties.
