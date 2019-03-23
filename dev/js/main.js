"use strict"

/* INITIALIZATION */
//DOM elements
const charts = document.getElementById('charts')
const themeSwitch = document.getElementById('themeSwitch')

//default sizing
const navHeight = 60
const borderPadding = 5
const chartPaddingBottom = 20
const chartPaddingTop = 7
const chartPolylineWidth = 2
const verticalLineWidth = 2
const chartLineWidth = 1
const chartNavLineWidth = 1
const chartCircleRaduus = 5
const dateItemWidth = 150
const minDistance = 50

//themes
let darkThemeStatus = false
const themes = {
  dark: {
    gorizontal: '#384658',
    vertical: '#3b4a5a',
    text: '#657182',
    circle: '#242f3e',

  },
  light: {
    gorizontal: '#ecf0f3',
    vertical: '#dfe6eb',
    text: '#96a2aa',
    circle: '#ffffff',
  }
}

let currentTheme = themes.light





/* CREATING NEW DOM ELEMENTS */
//create new DOM elevemt <animate>
const createAnimate = (start, end) => {
  const animate = document.createElementNS("http://www.w3.org/2000/svg", 'animate')
  animate.setAttribute('attributeName', 'points')
  animate.setAttribute('attributeType', 'XML')
  animate.setAttribute('dur', '.5s')
  animate.setAttribute('from', start)
  animate.setAttribute('to', end)
  animate.setAttribute('repeatCount', '1')

  return animate
}

//create new DOM elevemt <polyline>
const createPolyline = (color, stroke, id, points) => {
  const polyline = document.createElementNS("http://www.w3.org/2000/svg", 'polyline')
  polyline.setAttribute('fill', 'none')
  polyline.style.stroke = color
  polyline.style.strokeWidth = stroke
  polyline.setAttribute('id', id)
  polyline.setAttribute('points', points)
  polyline.setAttribute('pathLength', 1000)

  return polyline
}

//create new DOM elevemt <circle>
const createCircle = (x, y, r, color, stroke) => {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
  circle.setAttribute('fill', currentTheme.circle)
  circle.setAttribute('cx', x)
  circle.setAttribute('cy', y)
  circle.setAttribute('r', r)
  circle.style.stroke = color
  circle.style.strokeWidth = stroke

  return circle
}

//create new DOM element <line>
const createLine = (x1, y1, x2, y2, className) => {
  const line =  document.createElementNS("http://www.w3.org/2000/svg", 'line')
  line.setAttribute('x1', x1)
  line.setAttribute('y1', y1)
  line.setAttribute('x2', x2)
  line.setAttribute('y2', y2)
  line.setAttribute('class', className)
  line.style.stroke = currentTheme.gorizontal
  line.style.strokeWidth = chartLineWidth

  return line
}

//create new DOM element <text>
const createText = (x, y, value, className) => {
  const text = document.createElementNS("http://www.w3.org/2000/svg", 'text')
  text.setAttribute('x', x)
  text.setAttribute('class', className)
  text.setAttribute('y', y)
  text.setAttribute('fill', currentTheme.text)
  text.innerHTML = value

  return text
}





/* SWITCH THEME */
//toggle theme button callback
const toggleTheme = () => {
  document.body.classList.toggle('dark')

  darkThemeStatus = !darkThemeStatus
  currentTheme = darkThemeStatus ? themes.dark : themes.light
  themeSwitch.innerHTML = `Switch to ${darkThemeStatus ? 'Day' : 'Night'} Mode`

  const gorizontals = document.getElementsByClassName('gorizontal')
  for (let line of gorizontals) {
    line.style.stroke = currentTheme.gorizontal
  }

  const values = document.getElementsByClassName('value')
  for (let text of values) {
    text.setAttribute('fill', currentTheme.text)
  }

  const verticals = document.getElementsByClassName('vertical')
  for (let vertical of verticals) {
    vertical.style.stroke = currentTheme.vertical
  }
}





/* WORKING WITH DATA */
//render all charts
data.forEach((chartData, dataIndex) => {

  //create DOM elements
  const chartBlock = document.createElement('div')
  chartBlock.className = 'chartBlock'

  const chart = document.createElement('div')
  chart.className = 'chart'

  const chartSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
  chartSvg.classList.add('chartSvg')

  const vertical = document.createElementNS("http://www.w3.org/2000/svg", 'line')
  vertical.classList.add('vertical')

  const nav = document.createElement('div')
  nav.className = 'nav'

  const navLeft = document.createElement('div')
  navLeft.className = 'navLeft'

  const navRight = document.createElement('div')
  navRight.className = 'navRight'

  const navSvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
  navSvg.classList.add('navSvg')

  const legend = document.createElement('div')
  legend.className = 'legend'
  
  const modal = document.createElement('div')
  modal.className = 'modal'

  const modalDate = document.createElement('div')
  modalDate.className = 'modalDate'

  const modalLegend = document.createElement('div')
  modalLegend.className = 'modalLegend'

  chartSvg.append(vertical)
  modal.append(modalDate, modalLegend)
  chart.append(chartSvg, modal)
  nav.append(navSvg, navLeft, navRight)
  chartBlock.append(chart, nav, legend)
  charts.append(chartBlock)

  //area sizing
  let width = nav.offsetWidth
  let height = chart.offsetHeight

  //initial values for navigation range
  let navLeftValue = .5 * width
  let navRightValue = .9 * width 

  let eventStartX = 0
  let movingType = 'center'

  let chartLineMax = 0
  let updatingChartLines  = null

  let selectedX = []
  let selectedY = {}
  let defaultDate = {
    x: 0,
    value: 0,
  }
  let chartX = []
  let scaledColumns = {}
  let chartMinValue = 0
  let chartMaxValue = 0
  let step = 0

  vertical.style.stroke = currentTheme.vertical
  vertical.style.strokeWidth = verticalLineWidth

  //get chart data
  chartData.show = {}
  chartData.points = {}
  chartData.navPoints = {}

  //remove first items from columns
  const columns = {}
  chartData.columns.forEach(e => {
    const key = e.splice(0, 1)
    columns[key] = e
    chartData.show[key] = true
  })

  //get axis X data
  const x = columns.x
  delete columns.x





  /*CALLBACKS AND HELPERS */
  //callback for moving event on nav
  const navEventMoveCallback = (event) => {
    const eventEndX = event.pageX - nav.offsetLeft

    //updating values of range
    if (movingType === 'left')
      navLeftValue += eventEndX - eventStartX
    else if(movingType === 'right')
      navRightValue -= eventStartX - eventEndX
    else{
      if (navLeftValue > 0)
        navRightValue -= eventStartX - eventEndX
      if (navRightValue < width)
        navLeftValue += eventEndX - eventStartX
    }
    
    //checking of extreme values
    if (navLeftValue < 0) navLeftValue = 0
    if (navRightValue > width) navRightValue = width
    
    if (movingType === 'right' && navRightValue < navLeftValue + 2 * borderPadding)
      navRightValue = navLeftValue + 2 * borderPadding

    if (movingType === 'left' && navLeftValue > navRightValue - 2 * borderPadding)
      navLeftValue = navRightValue - 2 * borderPadding
    
    //rerender chart
    updateNavLeftBorder()
    updateNavRightBorder()
    updateChart()
    updateDates()
    
    eventStartX = eventEndX
  }

  //defenition of moving type
  const definitionMovingType = (event) => {
    eventStartX = event.pageX - nav.offsetLeft

    //definition of navigation section
    movingType = 'center'
    if (eventStartX < navLeftValue + borderPadding )
      movingType = 'left'
    else if (eventStartX > navRightValue - borderPadding)
      movingType = 'right'
  }

  //formating of date
  const dateFormat = (value, type) => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const date = new Date(value)

    if (type === 'withDay')
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`

    return `${months[date.getMonth()]} ${date.getDate()}`
  }

  //replace Y values for polyline poins
  const endPointsReplacer = (match, p1, p2, p3, p4) => `${p1},${p3 ?  '' : '-'}${p4}`

  //resize callback
  const resize = () => {
    const newWidth = nav.offsetWidth

    navLeftValue = newWidth * navLeftValue / width
    navRightValue = newWidth * navRightValue / width

    width = newWidth

    //rerender chart lines with new header
    if (height !== chart.offsetHeight)
      chartLineMax = 0

    height = chart.offsetHeight

    updateNavLeftBorder()
    updateNavRightBorder()

    updateNavChart()
    updateChart()
    updateDates()

    //update chartLines width
    const lines = chartSvg.querySelectorAll('.gorizontal')
    lines.forEach(line => {
      line.setAttribute('x2', width)
    })
  }

  //remove <circle> elements
  const removeCircles = () => {
    const circles = chartSvg.querySelectorAll('circle')
    circles.forEach(circle => {
      circle.remove()
    })
  }

  //callback for moving event on chart
  const chartEventMoveCallback = (event) => {
    if(event.target !== chartSvg) return

    removeCircles()

    const eventX = event.offsetX

    //search chart point
    let index = -1
    chartX.forEach((x, i) => {
      if (step * i < eventX && step * (i + 1) < eventX) return
      if (step * i > eventX && step * (i + 1) > eventX) return
      index = (eventX - step * i > step * (i + 1) - eventX) ? i + 1 : i 
    })
    if (index === -1) return

    //move vertical line
    vertical.setAttribute('x1', eventX)
    vertical.setAttribute('x2', eventX)
    vertical.setAttribute('y1', 0)
    vertical.setAttribute('y2', height - chartPaddingBottom + 4)

    let legend = ''

    modalLegend.innerHTML = ''

    //render modal legend
    Object.keys(columns).forEach(key => {
      if (!chartData.show[key]) return

      const circle = createCircle(
        chartX[index], 
        scaledColumns[key][index], 
        chartCircleRaduus, 
        chartData.colors[key], 
        chartPolylineWidth
      )
      chartSvg.append(circle)

      const legendItem = document.createElement('div')
      const legendItemValue = document.createElement('b')
      const legendItemName = document.createElement('span')

      legendItemValue.innerHTML = selectedY[key][index]
      legendItemName.innerHTML = chartData.names[key]
      legendItem.append(legendItemValue)
      legendItem.append(legendItemName)
      legendItem.setAttribute('style',`color: ${chartData.colors[key]}`)
      modalLegend.append(legendItem)
    })

    const modalWidth = modal.offsetWidth || 100
    const x = chartX[index] + modalWidth + 10 > width 
      ? chartX[index] - modalWidth - 10
      : chartX[index] + 10
    
    modalDate.innerHTML = dateFormat(selectedX[index], 'withDay')
    modal.setAttribute('style',`top: 0px; left: ${x}px`)
    modal.classList.add('active')
  }

  //calback for touch event on chart
  const chartEventLeaveCallback = (event) => {
    if(event.target !== chartSvg) return

    //hide vertical line
    vertical.setAttribute('x1', 0)
    vertical.setAttribute('x2', 0)
    vertical.setAttribute('y1', 0)
    vertical.setAttribute('y2', 0)

    //remove circles
    removeCircles()

    //hide modal
    modal.classList.remove('active')
  }

  //callback for click to legend
  const legendEventClickcallback = (event) => {
    //definition element id
    let id = ''
    if (event.target.getAttribute('id')) {
      id = event.target.getAttribute('id')
      event.target.classList.toggle('active')
    }
    else {
      id = event.target.parentNode.getAttribute('id')
      event.target.parentNode.classList.toggle('active')
    }

    if (!id) return
    
    //definition key
    const match = /^legend-item-(.+)-(.+)$/ig.exec(id)
    const key = match[2]

    //toggle legend item
    chartData.show[key] = !chartData.show[key] 

    const endPointsReg = /(\d+(\.\d+)?),(\-)?(\d+(\.\d+)?)/ig

    //toggle chart in navigation
    const navChart = navSvg.getElementById(`nav-svg-${dataIndex}-${key}`)
    if (navChart) {
      navChart.innerHTML = ''

      const startPoints = chartData.navPoints[key]
      const endPoints = startPoints.replace(endPointsReg, endPointsReplacer)

      const animateNavChart = createAnimate(startPoints, endPoints)
      navChart.append(animateNavChart)
      //not works on edge, need alternative
      animateNavChart.beginElement()

      setTimeout(() => navChart.setAttribute('points', endPoints), 500)
      chartData.navPoints[key] = endPoints
    }
    //toggle chart
    const chart = chartSvg.getElementById(`chart-svg-${dataIndex}-${key}`)
    if (chart) {
      chart.innerHTML = ''

      const startPoints = chartData.points[key]
      const endPoints = startPoints.replace(endPointsReg, endPointsReplacer)

      const animateChart = createAnimate(startPoints, endPoints)
      chart.append(animateChart)
      //not works on edge, need alternative
      animateChart.beginElement()

      setTimeout(() => chart.setAttribute('points', endPoints), 500)
      chartData.points[key] = endPoints
    }

    setTimeout(() => updateChart(false, true), 500)
  }






  /* RENDERS OF CHARTS */
  //render left border
  const updateNavLeftBorder = () => navLeft.style.width = navLeftValue + 'px'

  //render right border
  const updateNavRightBorder = () => navRight.style.width = (width - navRightValue) + 'px'

  //render chart
  const updateChart = (initial, toggle) => {
    //initial options for chart
    chartMinValue = Infinity
    chartMaxValue = 0

    let diffValue = 0

    const start = parseInt(x.length * navLeftValue / width, 10)
    const end = parseInt(x.length * navRightValue / width, 10)
    selectedX = x.slice(start, end)
    step = width / (selectedX.length - 1)
    let chartXValue = -step
    
    chartX = selectedX.map(x => chartXValue += step)

    Object.keys(columns).forEach(key => {
      if (!chartData.show[key]) return

      let points = ''
      const selection = columns[key].slice(start, end)
      selection.forEach(e => {
        if(chartMinValue > e) chartMinValue = e
        if(chartMaxValue < e) chartMaxValue = e
      })

      scaledColumns[key] = []
      selectedY[key] = selection

      const scale = (height - chartPaddingBottom) / chartMaxValue
      selection.forEach((e, index) => {
        const value = height - scale * e - chartPaddingBottom + chartPaddingTop
        scaledColumns[key].push(value)
        points += `${chartX[index]},${value} `
      })

      //initial render of chart
      if(initial) {
        const polyline = createPolyline(
          chartData.colors[key], 
          chartPolylineWidth,
          `chart-svg-${dataIndex}-${key}`, 
          points
        )
        chartSvg.append(polyline)
      }
      //rerender of chart
      else {
        const chart = document.getElementById(`chart-svg-${dataIndex}-${key}`) 
        chart.innerHTML = ''
        const startPoints = chartData.points[key]

        //add animation for foggle of chart and lines
        if (toggle) {
          const animate = createAnimate(startPoints, points)      
          chart.append(animate)
          //not works on edge, need alternative
          animate.beginElement()
        }

        chart.setAttribute('points', points)
      }

      chartData.points[key] = points
    })

    //rerender of chart lines
    if (updatingChartLines) clearTimeout(updatingChartLines)
    updatingChartLines = setTimeout(() => updateChartLines(), 300)
  }

  //render of chart lines
  const updateChartLines = () => {
    let steps = parseInt( .9 *height / minDistance, 10)
    if (steps > 5) steps = 5

    const heightStep = steps > 0 ? parseInt( .9 *height / steps, 10) : 0

    const valueStep = parseInt( (chartMaxValue - (chartMinValue > 0 ? 0 : chartMinValue)) / minDistance, 10)
    if (chartLineMax === chartMaxValue) return

    chartLineMax = chartMaxValue
    
    //remove old titles
    const oldTitles = chartSvg.querySelectorAll('.value')
    oldTitles.forEach(oldTitle => {
      oldTitle.classList.remove('active')
      oldTitle.classList.add('remove')
      setTimeout(() => oldTitle.remove(),1000)
    })

    //remove old lines
    const oldLines = chartSvg.querySelectorAll('.gorizontal')
    oldLines.forEach(oldLine => {
      oldLine.classList.remove('active')
      oldLine.classList.add('remove')
      setTimeout(() => oldLine.remove(),1000)
    })

    //render only axisX if all chart is hidded 
    if(!valueStep || !heightStep) {
      const line = createLine(
        0,  
        height - chartPaddingBottom + 4, 
        width, 
        height - chartPaddingBottom + 4, 
        'gorizontal'
      )
      chartSvg.prepend(line)
      line.classList.add('active')
      return
    }
    else {
      //render of new titles and lines
      const max = steps < 5 ? steps : 6
      for(let i = 0; i < max; i++) {
        const y = height - i * heightStep

        const line = createLine(
          0,  
          y - chartPaddingBottom + 4, 
          width, 
          y - chartPaddingBottom + 4, 
          'gorizontal'
        )
        chartSvg.prepend(line)
        setTimeout(() => line.classList.add('active'), 200)

        const text = createText(0, y - 4 - chartPaddingBottom, i * valueStep, 'value')
        chartSvg.prepend(text)
        setTimeout(() => text.classList.add('active'), 200)
      }
    }
  }

  //render of chart to navigations
  const updateNavChart = (initial) => {
    //initial options for navigation
    let minValue = Infinity
    let maxValue = 0
    

    const step = width / (x.length - 1)
    let navXValue = -step
    const navX = x.map(x => navXValue += step)

    Object.keys(columns).forEach(key => {
      let points = ''

      columns[key].forEach((e, index) => {
        if (minValue > e) minValue = e
        if (maxValue < e) maxValue = e
      })

      const scale = navHeight / maxValue
      columns[key].forEach((e, index) => {
        points += `${navX[index]},${navHeight - scale * (e - minValue)} `
      })

      //initial render of navChart
      if (initial) {
        const navPolyline =createPolyline(
          chartData.colors[key], 
          chartNavLineWidth, 
          `nav-svg-${dataIndex}-${key}`, 
          points
        )
        navSvg.append(navPolyline)
      }
      //update navChart
      else {
        const chart = document.getElementById(`nav-svg-${dataIndex}-${key}`)
        if (chart) chart.setAttribute('points', points)
      }

      chartData.navPoints[key] = points
    })
  }

  //render dates
  const updateDates = (initial) => {
    const lenght = selectedX.length
    if(lenght === 0) return

    //remove old titles
    const oldDates = chartSvg.querySelectorAll('.date')
    oldDates.forEach(olddate => olddate.remove())

    let stepWidth = dateItemWidth
    let stepsNumber = parseInt( width / stepWidth, 10)
    if (stepsNumber > lenght) {
      stepsNumber = lenght
      stepWidth = parseInt(width / stepsNumber, 10)
    }

    const indexStep = parseInt(lenght / stepsNumber, 10)
    
    let defaultDateIndex = selectedX.findIndex( x => x === defaultDate.value)

    if(defaultDateIndex === -1) {
      defaultDate.x = 0;
      defaultDate.value = selectedX[0]
      defaultDateIndex = 0;
    }
    else
      defaultDate.x = chartX[defaultDateIndex]

    //create new date list
    const showedDates = [defaultDate]

    if (indexStep > 0) {
      //dates from left of the defaultDate
      for (let i = defaultDateIndex - indexStep; i >= 0; i -= indexStep) {
        showedDates.unshift({
          x: chartX[i],
          value: selectedX[i]
        })
      }

      //dates from left of the default date
      for (let i = defaultDateIndex + indexStep; i < lenght; i += indexStep) {
        showedDates.push({
          x: chartX[i],
          value: selectedX[i]
        })
      }
    }

    //update defaultDate
    defaultDate = showedDates[parseInt(showedDates.length / 2, 10)]

    //rerender dates
    showedDates.forEach(date => {
      const dateItem = createText(date.x, height - 2, dateFormat(date.value), 'date')
      dateItem.setAttribute('style', 'font-size: 12px;')
      chartSvg.append(dateItem)
    })
  }





  /* INITIAL RENDER CHARTS*/
  //initial render of chart
  updateNavLeftBorder()
  updateNavRightBorder()
  updateChart(true)
  updateNavChart(true)
  updateDates(true)

  //render of legend list
  Object.keys(columns).forEach(key => {
    const legendItem = document.createElement('div')
    legendItem.setAttribute('id', `legend-item-${dataIndex}-${key}`)
    legendItem.classList.add('legendItem', 'active')
    
    const circle = document.createElement('div')
    circle.style.background=chartData.colors[key]
    
    legendItem.append(circle)
    legendItem.innerHTML += `<span>${chartData.names[key]}</span>`
    legend.append(legendItem) 
  })





  /* EVENT LISTENERS */
  //mouse click event listener for navigation
  nav.addEventListener('mousedown', (mousedownEvent) => {
    definitionMovingType(mousedownEvent)

    //callback for touch end event
    const mouseEndCallback = () => {
      document.removeEventListener('mousemove', navEventMoveCallback)
      document.removeEventListener('mouseup', mouseEndCallback)
    }

    //event listener for mouse moving
    document.addEventListener('mousemove', navEventMoveCallback)

    //removing of event listeners
    document.addEventListener('mouseup', mouseEndCallback)
  })

  //mouse click event listener for navigation
  nav.addEventListener('touchstart', (touchStartEvent) => {
    definitionMovingType(touchStartEvent)

    //callback for touch end event
    const touchEndCallback = () => {
      document.removeEventListener('touchmove', navEventMoveCallback)
      document.removeEventListener('touchend', touchEndCallback)
    }

    //event listener for mouse moving
    document.addEventListener('touchmove', navEventMoveCallback)

    //removing of event listeners
    document.addEventListener('touchend', touchEndCallback)
  })

  //event listener for mouse moving inside chart area
  chartSvg.addEventListener('mousemove', chartEventMoveCallback)

  //event listener for leaving mouse from chart area
  chartSvg.addEventListener('mouseleave', chartEventLeaveCallback)

  //event listener for touch moving inside chart area
  chartSvg.addEventListener('touchstart', chartEventMoveCallback)

  //event listener for leaving touch from chart area
  chartSvg.addEventListener('touchend', chartEventLeaveCallback)

  //event listener for legend
  legend.addEventListener('click', legendEventClickcallback)

  //event listener for resizing of window
  window.addEventListener('resize', resize)
})