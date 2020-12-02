// jQuery
// Import HTML Page
/*
<head>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
</head>
<body>
	<div id="01">
		<p id="demo" class="intro">Demo Paragraph</p>
	</div>
</body>
*/
// Finding HTML Element(s);
var oDemo = $("#demo"),					// by ID
	oParagraphs = $("p"),				// by Tag Name
	oClass = $(".intro"),				// by Class Name
	oClassParagraphs = $("p.intro");	// by CSS Selectors

// Text Content
oDemo.text();			// GET 		
oDemo.text("Serhat");	// SET 

// HTML Content
var oDiv = $("#01");
oDiv.html();						// GET => <p class="intro" id="demo">Demo Paragraph</p>
oDiv.html("<p>Hello World!</p>");	// SET => <p>Hello World</p>

// CSS: HTML Elements
oDemo.hide();					// Hiding 
oDemo.show();					// Showing
oDemo.css("font-size","35px");	// Styling

// DOM
oDemo.remove();						// Removing Elements
oDemo.parent();						// Get Parent Element
oDemo.parent().prop("nodeName");	// Get Parent Element Name
