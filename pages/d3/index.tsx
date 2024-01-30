import { FC } from "react";
import * as d3 from "d3";

interface D3PageProps {}

const D3Page: FC<D3PageProps> = () => {
  const drawLineChart = async () => {
    const dataset = await d3.json("my_weather_data.json");
    console.table("data", dataset);

    const yAccessor = (d) => d.temperatureMax;
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccessor = (d) => dateParser(d.date);

    // 2. Create chart dimensions

    let dimensions = {
      width: window.innerWidth * 0.9,
      height: 400,
      margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
      },
      boundedWidth: 0,
      boundedHeight: 0,
    };
    dimensions.boundedWidth =
      dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    // 3. Draw canvas

    const wrapper = d3
      .select("#wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      );

    // 4. Create scales

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0]);

    const freezingTemperaturePlacement = yScale(32);
    const freezingTemperatures = bounds
      .append("rect")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", freezingTemperaturePlacement)
      .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
      .attr("fill", "#e0f3f3");

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth]);

    // 5. Draw data

    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    const line = bounds
      .append("path")
      .attr("d", lineGenerator(dataset) /* "M 0 0 L 100 0 100 100 L 0 100" */)
      .attr("fill", "none")
      .attr("stroke", "#af9358")
      .attr("stroke-width", 2);

    // 6. Draw peripherals
    const yAxisGenerator = d3.axisLeft().scale(yScale);

    const yAxis = bounds.append("g").call(yAxisGenerator);

    const xAxisGenerator = d3.axisBottom().scale(xScale);

    const xAxis = bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);
  };

  if (typeof window !== "undefined") {
    drawLineChart();
  }

  //SCATTER CHART
  const drawScatterChart = async () => {
    //1) ACCESS DATA
    const data = await d3.json("my_weather_data.json");

    const xAccessor = (d) => d.dewPoint;
    const yAccessor = (d) => d.humidity;

    console.log(xAccessor(data[0]), yAccessor(data[0]));

    //2) CREATE CHART DIMENSIONS
    const width = d3.min([window.innerWidth * 0.5, window.innerHeight * 0.5]);
    const dimensions: any = {
      width,
      height: width,
      margins: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50,
      },
      boundedWidth: 0,
      boundedHeight: 0,
    };

    dimensions.boundedWidth =
      dimensions.width - dimensions.margins.left - dimensions.margins.right;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

    //3 DRAW CANVAS

    const wrapper = d3
      .select("#scatterWrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .style("border", "1px solid black")
      .style("transform", `translateX(${dimensions.margins.left}px)`);

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`
      );

    //4 CREATE SCALES
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yAccessor))
      .range([dimensions.boundedHeight, 0])
      .nice();

    //5 DRAW DATA
    /* data.forEach((d) => {
      bounds
        .append("circle")
        .attr("cx", xScale(xAccessor(d)))
        .attr("cy", yScale(yAccessor(d)))
        .attr("r", 3);
    }); */
    const dots = bounds
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 3);

    console.log(dots);

    //6 DRAW PERIPHERALS
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);

    const yAxisGenerator = d3.axisLeft().scale(yScale);
    bounds.append("g").call(yAxisGenerator);
  };

  if (typeof window !== "undefined") {
    drawScatterChart();
  }

  return (
    <div>
      <div id="wrapper"></div>
      <div id="scatterWrapper"></div>
    </div>
  );
};

export default D3Page;
