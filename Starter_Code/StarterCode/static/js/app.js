// Biodiversity Dashboard Assignment 

// Initialize the dashboard and display default plots
function initialize()
{
  // access the dropdown selector from index.html file
  var select = d3.select("#selDataset");

  // Need to get list of names to add on to selector
  // Use d3.json to get the data - need names property out of data
  d3.json("samples.json").then((data) => {
      let sample_names = data.names; // made an array of just the names
      // console.log(sample_names);

      // Iterate through the names Array by using a forEach to create options for each sample in the selector
      sample_names.forEach((sample) => {
        select.append("option")
          .text(sample)
          .property("value", sample);
      });

      // When initialized, pass in information for the first sample
      let sample_1 = sample_names[0];

      // call the function to build the metadata
      demo_info(sample_1);
      // call the function to build bar chart
      buildBarChart(sample_1);
      //call the function to build bubble chart
      buildBubbleChart(sample_1);
  });
}

// Function that populates the metadata
function demo_info(sample)
{
  // console.log(sample);

  // use d3.json in order to get the data
  d3.json("samples.json").then((data) => {
      // grab all of the metadata
      let metadata = data.metadata;
      // console.timeLog(metadata)

      // filter based on the value of the sample (returns one result based on dataset)
      let filtered_data = metadata.filter((result) => result.id == sample);
      // result is object produced when we go filter out metadata based on selected value of sample passed in
      // console.log(filtered_data);

      // access index 0 from array / assign the first object to object variable
      let obj = filtered_data[0];
      // console.log(obj);

      // clear the child elements in div with id sample-metadata
      d3.select("#sample-metadata").html("");

      // use Object.entries() to get value key pairs
      // Object.entries() is a built-in method in JavaScript
      Object.entries(obj).forEach(([key, value]) => {
        // add to the sample data/demographics section
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });
}

// Function that builds the graphs
function buildBarChart(sample)
{
  // console.log(sample);
  // let data = d3.json("samples.json");
  // console.log(data);

  d3.json("samples.json").then((data) => {
    // grab all of the samples
    let sample_data = data.samples;

    // filter based on the value of the sample (returns one result based on dataset)
    let filtered_data = sample_data.filter((result) => result.id == sample);
    // result is object produced when we go filter out metadata based on selected value of sample passed in

    // access index 0 from array 
    let obj = filtered_data[0];

    // get the otu_ids, labels, and sample_values
    let otu_ids = obj.otu_ids;
    let otu_labels = obj.otu_labels;
    let sample_values = obj.sample_values;

    // build the bar chart
    // use slice to get top 10 otus found
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let x_vals = sample_values.slice(0, 10).reverse();
    let text_labels = otu_labels.slice(0, 10).reverse();
    console.log(yticks);
    console.log(x_vals);
    console.log(text_labels);

    let bar_chart = 
    {
      y: yticks,
      x: x_vals,
      text: text_labels, 
      type: "bar",
      marker: {
              color: "rgb(166,172,237)"
            },
      orientation: "h",
    }

    let layout = {
      title: "Top 10 Bacteria",
    };

    Plotly.newPlot("bar", [bar_chart], layout);
  });
}

// Function that builds the bubble chart
function buildBubbleChart(sample)
{
  // console.log(sample);
  // let data = d3.json("samples.json");
  // console.log(data);

  d3.json("samples.json").then((data) => {
    // grab all of the samples
    let sample_data = data.samples;

    // filter based on the value of the sample (returns one result based on dataset)
    let filtered_data = sample_data.filter((result) => result.id == sample);
    // result is object produced when we go filter out metadata based on selected value of sample passed in

    // access index 0 from array 
    let obj = filtered_data[0];

    // get the otu_ids, labels, and sample_values
    let otu_ids = obj.otu_ids;
    let otu_labels = obj.otu_labels;
    let sample_values = obj.sample_values;

    // build the bubble chart

    let bubble_chart = {
      y: sample_values,
      x: otu_ids,
      text: otu_labels, 
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Blues"
      }
    }

    let layout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", [bubble_chart], layout);
  });
}

  // Function that updates the dashboard/toggles to new plots when option changed
  function optionChanged(item) {
    // call the update to the metadata
    demo_info(item);
    // call function to build the bar chart
    buildBarChart(item);
    //call function to build the bubble chart
    buildBubbleChart(item);
  }

  // initialize
  initialize();


