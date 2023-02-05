full_data_string = "All Data"
animateGraph = false; // determines whether lines will animate

// Client for new data source setup (CMD program)
// name, filepath, min/max year, csv header/column names (groups) with colors

ccc_dataSources = [
    {
       "name": "citations",
       "generative_func": "citationsGraph",
       "selected": true,
       "filepath":"data/science.csv",
       "min_year": 1800,
       "max_year": 2020,
       "groups": {
            "All Data": true,
            "China (domestic)": false,
            "United States (domestic)": false,
        }
    },
    {
       "name": "papers",
       "generative_func": "papersGraph",
       "selected":false,
       "filepath":"data/science.csv",
       "min_year": 1800,
       "max_year": 2020,
       "groups": {
            "All Data": true,
            "China (domestic)": false,
            "United States (domestic)": false,
        }
    },
    {
       "name": "roads",
       "generative_func": "roadGraph",
       "selected":false,
       "filepath":"data/roads.csv",
       "min_year": 1980,
       "max_year": 2020,
       "groups": {
          "All Data": true,
          "China (domestic)": false,
          "United States (domestic)": false,
          "Highways": false,
          "Expressways": false,
       }
    },
    {
        "name": "internet",
        "generative_func": "internetUseGraph",
        "selected":false,
        "filepath":"data/internet.csv",
        "min_year": 1997,
        "max_year": 2020,
        "groups": {
          "All Data": true,
          "China (domestic)": false,
          "United States (domestic)": false,
          "Broadband": false,
          "Access": false,
          "Mobile": false,
       }
    },
    {
        "name": "patent",
        "generative_func": "patentGraph",
        "selected": false,
        "filepath":"data/patent.csv",
        "min_year": 1970,
        "max_year": 2020,
        "groups": {
            "All Data": true,
            "China (domestic)": false,
            "United States (domestic)": false,
        }
    }
]
