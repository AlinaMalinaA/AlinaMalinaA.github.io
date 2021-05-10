const create_elem = require("../js/telepathy.js");


describe("Testing telepathy functions", () => {
  test("Function create_elem - returns HTML element DIV with properties", async () => {
	let elementID = "testElement"
	let elementType = "DIV"
	let elementText = "test text"
	let elementClass = "childclass"
    let result = create_elem(elementType, elementID, null, elementText, elementClass); 
	expect(result).toHaveProperty('nodeName', "DIV");
	expect(result).toHaveProperty('id', elementID);
	expect(result).toHaveProperty('className', elementClass);
	let allTextNodes = [...result.childNodes].map(element => element.nodeValue);
	expect(allTextNodes).toContain(elementText);
  });
});