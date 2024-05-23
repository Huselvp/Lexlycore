const Fill = () => {
  const svgStyles = {
    ".st0": { fill: "#303651" },
    ".st1": { fill: "green" },
    ".st2": { fill: "#2D3550" },
    ".st3": { fill: "green" }
    // Add other styles as needed
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
      <g>
        {Object.entries(svgStyles).map(([className, style]) => (
          <style
            key={className}
          >{`${className} { fill: ${style.fill}; }`}</style>
        ))}
        <g>
          <path
            className="st53"
            d="M459.1,392.5H41.7c-11.3,0-20.4-8.9-20.4-19.7V147.4c0-10.9,9.2-19.7,20.4-19.7h417.4c11.3,0,20.4,8.9,20.4,19.7v225.5C479.6,383.7,470.4,392.5,459.1,392.5z"
          />
          <path
            className="st53"
            d="M465.4,457.9h-430c-7.8,0-14.1-5.6-14.1-12.5v-7.3c0-6.9,6.3-12.5,14.1-12.5h430.1c7.8,0,14.1,5.6,14.1,12.5v7.3C479.6,452.3,473.2,457.9,465.4,457.9z"
          />
          {/* Add other SVG paths and elements here */}
          <line className="st54" x1="222" y1="182.9" x2="399.1" y2="182.9" />
          <line className="st54" x1="222" y1="221.5" x2="399.1" y2="221.5" />
          <line className="st54" x1="222" y1="297.3" x2="399.1" y2="297.3" />
          <line className="st54" x1="222" y1="333.9" x2="399.1" y2="333.9" />
          <ellipse
            transform="matrix(7.088903e-02 -0.9975 0.9975 7.088903e-02 -197.1588 424.3322)"
            className="st55"
            cx="129.2"
            cy="318"
            rx="35.1"
            ry="35.1"
          />
          <path
            className="st56"
            d="M124,227.5c-3.8,3.8-10,3.8-13.9,0L88.7,206c-3.8-3.8-3.8-10,0-13.9c3.8-3.8,10-3.8,13.9,0l12.8,12.8c1,1,2.5,1,3.5,0l34.6-34.6c3.8-3.8,10-3.8,13.9,0c1.9,1.8,2.9,4.3,2.9,6.9c0,2.6-1,5.1-2.9,6.9L124,227.5z"
          />
          {/* ... add other paths ... */}
        </g>
      </g>
    </svg>
  )
}

export default Fill
