
import * as d3 from 'https://cdn.skypack.dev/d3@7';

// putting a cap on the bar heights
const valCap = (val) => {
   if (val > 0) {
      return Math.min(4, val)
   }

   if (val < 0) {
      return Math.max(-4, val)
   }

   return val
}

// drawing a bar chart of the game's position evals
export async function drawBar(game, targetID) {

   // specifying plot margins
   let margin = {
      top: 5, 
      right: 5,
      bottom: 40,
      left: 40
   }

   // specifying plot dimensions 
   let width = 800 - margin.left - margin.right
   let height = 160 - margin.top - margin.bottom

   let svg = d3.select("#" + targetID)
      .append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom)
      .append('g')
         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
   
   // adding our white rectangle
   svg.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', 0)
      .attr('height', height / 2)
      .attr('fill', 'white')

   // adding our black rectangle
   svg.append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('y', height / 2)
      .attr('height', height / 2)
      .attr('fill', 'black')

   // creating the xScale
   let xScale = d3.scaleBand()
      .domain(game.map(d => { return d.ply_number/2 }))
      .range([0, width])
      .padding(0.1)

   // appending the xScale
   svg.append('g')
      .style('font-size', '14px')
      .style('font-family', 'Roboto')
      .style('font-weight', 300)
      .style('color', '#6C757D')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale)
         .tickValues(xScale.domain().filter(function(d,i) { return !((i/2)%5) })))

   // creating the yScale
   let yScale = d3.scaleLinear()
      .domain([-4, 4])
      .range([height, 0])

   svg.append('g')
      .style("color", "black")
      .attr("transform", "translate(0," + width + ")")
      .call(d3.axisLeft(yScale)
         .ticks(5)
         .tickSize(-width)
         .tickFormat(""))

   // appending the yScale
   svg.append('g')
      .style('font-size', '14px')
      .style('font-family', 'Roboto')
      .style('font-weight', 300)
      .style('color', '#6C757D')
      .call(d3.axisLeft(yScale).tickValues([-4, -2, 0, 2, 4]))

   svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width/2 + 50)
      .attr("y", height + margin.top + 35)
      .text("Move Number")
      .style('font-size', '14px')
      .style('font-family', 'Roboto')
      .style('font-weight', 400)

   svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top - 15)
      .text("Evaluation")
      .style('font-size', '14px')
      .style('font-family', 'Roboto')
      .style('font-weight', 400)

   // drawing our bars
   svg.selectAll('.bar')
         .data(game)
      .enter().append('rect')
         .attr('class', 'bar')
         .attr('y', function(d, i) { return yScale(Math.max(0, valCap(d.evaluation))) })
         .attr('x', function(d, i) { return xScale(i/2) })
         .attr('height', function(d, i) { return Math.abs(yScale(valCap(d.evaluation)) - yScale(0)) })
         .attr('width', xScale.bandwidth())
         .attr('fill', function(d, i) { return d.evaluation > 0 ? '#4D96FF':'#FF6B6B' })
}