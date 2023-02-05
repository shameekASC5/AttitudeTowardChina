/*--------------------------------------------------------------*
 * Filename: graph_config.js
 * Author: Shameek Hargrave
 * Description: A JSON object containing the necessary metadata for
 * graph represenation. Specifically, the filepath, the name of each
 * statistical indicator (column of csv datafile) within that file and a corresponding color for each indicator the legend.
 *-------------------------------------------------------------*/

// Client for new data source setup (CMD program)
// name, filepath, csv header/column names (statistical indicator)

statisticalIndicators = [
    // Citations
    {
        "name": "PRC Academic Paper Citations",
        "x-axis": "year",
        "column_name": "cn_paper_citation",
        "color": "#ff0000", // PRC primary
        "category": "Education",
        "filepath":"data/science.csv",
    },
    {
        "name": "US Academic Paper Citations",
        "x-axis": "year",
        "column_name": "us_paper_citation",
        "color": "#0099C5", // USA primary
        "category": "Education",
        "filepath":"data/science.csv",
    },
    // Papers
    {
        "name": "PRC Academic Papers",
        "x-axis": "year",
        "column_name": "cn_paper_count",
        "color": "#ff0000", // PRC primary
        "category": "Education",
        "filepath":"data/science.csv",
    },
    {
        "name": "US Academic Papers",
        "x-axis": "year",
        "column_name": "us_paper_count",
        "color": "#0099C5", // USA primary
        "category": "Education",
        "filepath":"data/science.csv",
    },
    // Road data
    {
        "name": "PRC Highway Length",
        "x-axis": "year",
        "column_name": "China: Highway Length (by 10,000 kilometers)",
        "color": "#ff0000", // PRC primary
        "category": "Education",
        "filepath":"data/roads.csv",
    },
    {
        "name": "US public road and street",
        "x-axis": "year",
        "column_name": "US: Public  Road  and  Street  Length in US (by 10,000 kilometers)",
        "color": "#0099C5", // USA primary
        "category": "Education",
        "filepath":"data/roads.csv",
    },
    {
        "name": "PRC Expressway Length",
        "x-axis": "year",
        "column_name": "China: Length of Expressways (by 10,000 kilometers)",
        "color": "#B0000D",
        "category": "Education",
        "filepath":"data/roads.csv",
    },
    {
        "name": "US Expressway/Freeway Length",
        "x-axis": "year",
        "column_name": "US: Length of Interstate and Other Freeways and Expressways (by 10,000 kilometers)",
        "color": "#CCEAF3",
        "category": "Education",
        "filepath":"data/roads.csv",
    },
    // Innovation & Tech
    {
        "name": "PRC Internet Access",
        "x-axis": "year",
        "column_name": "cn_internet_access",
        "color": "#ff0000", // PRC primary
        "category": "Innovation & Technology",
        "filepath":"data/internet.csv",
    },
    {
        "name": "US Internet Access",
        "x-axis": "year",
        "column_name": "us_internet_access",
        "color": "#0099C5", // USA primary
        "category": "Innovation & Technology",
        "filepath":"data/internet.csv",
    },
    {
        "name": "PRC Mobile Internet Users",
        "x-axis": "year",
        "column_name": "cn_mobile_internet_users",
        "color": "#B0000D",
        "category": "Innovation & Technology",
        "filepath":"data/internet.csv",
    },
    {
        "name": "US Mobile Internet Users",
        "x-axis": "year",
        "column_name": "us_mobile_internet_users",
        "color": "#CCEAF3",
        "category": "Innovation & Technology",
        "filepath":"data/internet.csv",
    },
    {
        "name": "PRC Broadband Subscriptions",
        "x-axis": "year",
        "column_name": "cn_broadband_subscriptions",
        "color": "#CF666D",
        "category": "Innovation & Technology",
        "filepath":"data/internet.csv",
    },
    {
        "name": "US Broadband Subscriptions",
        "x-axis": "year",
        "column_name": "us_broadband_subscriptions",
        "color": "#88D5F3",
        "category": "Innovation & Technology",
        "filepath":"data/internet.csv",
    },
    {
        "name": "PRC Patents",
        "x-axis": "year",
        "column_name": "中国专利授权量",
        "category": "Innovation & Technology",
        "filepath":"data/patent.csv",
    },
    {
        "name": "US Patents",
        "x-axis": "year",
        "column_name": "US patents assignment",
        "category": "Innovation & Technology",
        "filepath":"data/patent.csv",
    },
    // Other
    {
        "name": "PRC Population",
        "x-axis": "year",
        "column_name": "cn_population",
        "color": "#CF666D",
        "category": "Other",
        "filepath":"data/internet.csv",
    },
    {
        "name": "US Population",
        "x-axis": "year",
        "column_name": "us_population",
        "color": "#88D5F3",
        "category": "Other",
        "filepath":"data/internet.csv",
    },
]

// Categories
ccc_dataSources = [
    {
        "category": "Education",
        "indicators": [
            "PRC Academic Paper Citations",
            "US Academic Paper Citations",
            "PRC Academic Papers",
            "US Academic Paper",
        ]
    },
    {
       "category": "Infrastructure",
       "indicators": [
            "PRC Highway Length",
            "US public road and street",
            "PRC Expressway Length",
            "US Expressway/Freeway Length",
        ]
    },
    {
        "category": "Innovation & Technology",
        "indicators": [
            "PRC Internet Access",
            "US Internet Access",
            "PRC Mobile Internet Users",
            "US Mobile Internet Users",
            "PRC Broadband Subscriptions",
            "US Broadband Subscriptions",
            "PRC Patents",
            "US Patents",
         ]
     },
     {
        "category": "Other",
        "indicators": [
            "PRC Population",
            "US Population",
        ]
    },
]
