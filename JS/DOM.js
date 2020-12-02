// Call Parent 
var oItem = this.byId("idItem").getDomRef(); // => this.document.getElementById("idItem").
oItem.parentElement.style.width = "100%";

// Find HTML Elements
document.getElementById("idElement"); // Find Element w/ ID			=>	ID  	=	"idElement"
document.getElementsByTagName("p")[0]; // Find Element w/ Tag			=> 	Tag		=	<p>	
document.getElementsByClassName("intro")[0]; // Find Element w/ Class		=>	Class	=	intro
document.querySelectorAll("p.intro")[0]; // Find Element w/ Tag & Class	=> 	Tag		=	<p>		Class =	intro
document.forms["form1"][0]; // Find Element w/ Form			=>	Form	=	form1

// Changing HTML Style
/*
<div id="div1"> 
	<p id="demo">Demo Paragraph</p>
</div>
*/

this.document.getElementById("demo").style.dispaly = "none"; // Hide Element
this.document.getElementById("demo").style.color = "blue"; // Change Element Text Color
this.document.getElementById("demo").style.backgroundColor = "#1ec5e5"; // Change Element Text Background Color

// HTML Events: click - change - focus - mouseover - mouseout - mousedown - mouseup - mousemove
// Click - 1
document.getElementById("demo").addEventListener("click", function () {
	alert("Hello World!");
});
// Click - 2
document.getElementById("myBtn").addEventListener("click", myFunction);

function myFunction() {
	alert("Hello World!");
}

// Nodes
var oParagraph = document.createElement("p"),
	oNode = document.createTextNode("This is a new paragraph."),
	oParent = document.getElementById("div1"),
	oChild = document.getElementById("demo");

oParagraph.appendChild(oNode);				// Creating a New Nodes
oParent.appendChild(oParagraph);			// Add Node To Division Ending
oParent.insertBefore(oParagraph, oChild);	// Add Node To Insert Before Child
oParent.replaceChild(oParagraph, oChild);	// Replace Place Children
oParent.remove();							// Remove Node From Page
oParent.removeChild(child); 				// Remove Node From Parent

// Collection
var oCollection = document.getElementsByTagName("p");
for (var i = 0; i < oCollection.length; i++) {
	oCollection[i].style.color = "red";
}

// Nodes List
var oNodelist = document.querySelectorAll("p");
for (var i = 0; i < oNodelist.length; i++) {
	oNodelist[i].style.color = "red";
}