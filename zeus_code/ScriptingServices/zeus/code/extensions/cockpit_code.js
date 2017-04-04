/* globals $ */
/* eslint-env node, dirigible */

const PATH = "/code";
const HTML_LINK = "../code/index.html";

//exports.getMenuItem = function() {
//	return {  
//      "name": "Code",
//      "path": PATH,
//      "link": HTML_LINK
//   };
//};

exports.getSidebarItem = function() {
	return {  
      "name": "Code",
      "path": PATH,
      "link": HTML_LINK,
      "category": "Develop",
      "order": 201
   };
};
